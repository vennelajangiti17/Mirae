// background.js

// 1. Listen for messages from your DASHBOARD (localhost)
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  console.log("Received message from website:", request);

  // Respond to the "ping"
  if (request.message === "ping") {
    sendResponse({ status: "online", version: "1.1" });
  }

  // Save the user's login token securely in the extension
  if (request.message === "syncToken") {
    chrome.storage.local.set({ token: request.token }, () => {
      sendResponse({ success: true, message: "Token synced to extension!" });
    });
  }

  return true;
});

// 2. Listen for messages from the CONTENT SCRIPT (Google Careers, LinkedIn, etc.)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  if (request.action === "saveJob") {
    // 🔐 Step A: Grab the user's specific token from Chrome's storage
    chrome.storage.local.get(['token'], (result) => {
      const token = result.token;

      if (!token) {
        sendResponse({ error: "You are not logged in! Please open your Mirae Dashboard and log in." });
        return;
      }

      // 🌐 Step B: Make the API call safely from the background
      fetch('http://localhost:5000/api/tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // The VIP wristband!
        },
        body: JSON.stringify(request.data)
      })
      .then(res => {
        if (res.status === 401) throw new Error("Session expired. Please log in to your Mirae dashboard again.");
        if (!res.ok) throw new Error("Server rejected request. Check backend terminal.");
        return res.json();
      })
      .then(data => {
        sendResponse({ success: true, data }); // Send success back to the content script alert
      })
      .catch(err => {
        console.error("Background Fetch Error:", err);
        sendResponse({ error: err.message || "Could not connect to Mirae Backend." });
      });
    });

    return true; // Tells Chrome to keep the message channel open for the async fetch
  }
});
