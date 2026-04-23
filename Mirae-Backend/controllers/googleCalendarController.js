const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CalendarEvent = require('../models/CalendarEvent');

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_CALENDAR_EVENTS_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

const getGoogleCredentials = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Google OAuth environment variables are missing. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI to .env.');
  }

  return { clientId, clientSecret, redirectUri };
};

const buildGoogleRedirectHtml = (message) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Google Calendar Connect</title>
  </head>
  <body style="font-family: sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f7fafc; margin:0;">
    <div style="text-align:center; max-width:420px; padding:24px; background:white; border-radius:16px; box-shadow:0 20px 60px rgba(15,23,42,.08);">
      <h1 style="margin-bottom:16px; font-size:22px;">Google Calendar Connected</h1>
      <p style="margin-bottom:24px; color:#334155;">${message}</p>
      <p style="color:#475569; font-size:14px;">You can close this window now.</p>
    </div>
    <script>
      if (window.opener) {
        window.opener.postMessage({ type: 'GOOGLE_CALENDAR_CONNECTED' }, '*');
      }
      setTimeout(() => { window.close(); }, 1500);
    </script>
  </body>
</html>`;
};

const parseStateToken = (state) => {
  if (!state) return null;
  try {
    return Buffer.from(decodeURIComponent(state), 'base64').toString('utf8');
  } catch (error) {
    return null;
  }
};

const refreshGoogleAccessToken = async (refreshToken) => {
  const params = new URLSearchParams({
    client_id: getGoogleCredentials().clientId,
    client_secret: getGoogleCredentials().clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || 'Failed to refresh Google access token');
  }

  return payload;
};

const getGoogleAuthUrl = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const encodedState = encodeURIComponent(Buffer.from(token).toString('base64'));
    const { clientId, redirectUri } = getGoogleCredentials();

    const url = `${GOOGLE_AUTH_URL}?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email')}&access_type=offline&prompt=consent&state=${encodedState}`;

    return res.status(200).json({ url });
  } catch (error) {
    console.error('Google auth URL error:', error.message);
    return res.status(500).json({ error: error.message || 'Unable to generate Google auth URL' });
  }
};

const handleGoogleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).send(buildGoogleRedirectHtml('Google did not return an authorization code.'));
    }

    const decodedToken = parseStateToken(state);
    if (!decodedToken) {
      return res.status(400).send(buildGoogleRedirectHtml('Google callback state is invalid.'));
    }

    const verified = jwt.verify(decodedToken, process.env.JWT_SECRET);
    if (!verified || !verified.id) {
      return res.status(401).send(buildGoogleRedirectHtml('Unable to verify the user token.'));
    }

    const user = await User.findById(verified.id);
    if (!user) {
      return res.status(404).send(buildGoogleRedirectHtml('User not found.'));
    }

    const { clientId, clientSecret, redirectUri } = getGoogleCredentials();
    const params = new URLSearchParams({
      code: String(code),
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const tokenPayload = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error('Google token exchange failed:', tokenPayload);
      return res.status(500).send(buildGoogleRedirectHtml('Failed to exchange Google authorization code.'));
    }

    user.googleRefreshToken = tokenPayload.refresh_token || user.googleRefreshToken;
    user.googleAccessToken = tokenPayload.access_token;
    user.googleTokenExpiry = Date.now() + (tokenPayload.expires_in || 0) * 1000;
    await user.save();

    return res.status(200).send(buildGoogleRedirectHtml('Google Calendar is now connected.'));
  } catch (error) {
    console.error('Google callback error:', error);
    return res.status(500).send(buildGoogleRedirectHtml('Google Calendar connection failed.'));
  }
};

const getGoogleConnectionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isConnected = Boolean(user.googleRefreshToken);
    return res.status(200).json({ connected: isConnected });
  } catch (error) {
    console.error('Google connection status error:', error.message);
    return res.status(500).json({ error: 'Unable to check Google connection status' });
  }
};

const createOrUpdateCalendarEvent = async (userId, googleEvent) => {
  const startDateTime = googleEvent.start?.dateTime || googleEvent.start?.date;
  const endDateTime = googleEvent.end?.dateTime || googleEvent.end?.date || startDateTime;
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  const title = googleEvent.summary || 'Google Calendar Event';
  const description = googleEvent.description || '';
  const location = googleEvent.location || '';

  const startsAt = startDateTime ? start.toISOString() : null;
  const endsAt = endDateTime ? end.toISOString() : null;

  const type = /interview|meeting|call/i.test(title) ? 'interview'
    : /deadline|due|submit|application/i.test(title) ? 'deadline'
    : 'other';

  return CalendarEvent.findOneAndUpdate(
    { googleEventId: googleEvent.id, userId },
    {
      $set: {
        title,
        description,
        date: startsAt || new Date(),
        startTime: startsAt ? start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
        endTime: endsAt ? end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
        type,
        status: 'pending',
        location,
        googleEventId: googleEvent.id,
        userId,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

const syncGoogleCalendar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.googleRefreshToken) {
      return res.status(400).json({ error: 'Google Calendar is not connected' });
    }

    let accessToken = user.googleAccessToken;
    const now = Date.now();

    if (!accessToken || user.googleTokenExpiry <= now + 60000) {
      const refreshed = await refreshGoogleAccessToken(user.googleRefreshToken);
      accessToken = refreshed.access_token;
      user.googleAccessToken = refreshed.access_token;
      user.googleTokenExpiry = Date.now() + (refreshed.expires_in || 0) * 1000;
      await user.save();
    }

    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const response = await fetch(`${GOOGLE_CALENDAR_EVENTS_URL}?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime&maxResults=50`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Google events fetch failed:', data);
      return res.status(500).json({ error: 'Failed to fetch Google Calendar events' });
    }

    const events = Array.isArray(data.items) ? data.items : [];
    const syncedEvents = await Promise.all(events.map((event) => createOrUpdateCalendarEvent(user._id, event)));

    return res.status(200).json({ message: 'Google Calendar synced', syncedCount: syncedEvents.length, events: syncedEvents });
  } catch (error) {
    console.error('Google sync error:', error);
    return res.status(500).json({ error: 'Failed to sync Google Calendar' });
  }
};

module.exports = {
  getGoogleAuthUrl,
  handleGoogleCallback,
  getGoogleConnectionStatus,
  syncGoogleCalendar,
};
