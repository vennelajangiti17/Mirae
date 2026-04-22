// --- 🖱️ RIGHT CLICK MENU SETUP ---
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-to-mirae",
    title: "✨ Save to Mirae",
    contexts: ["page", "selection"] 
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-to-mirae") {
    chrome.tabs.sendMessage(tab.id, { action: "triggerScrape" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Content script not found. Make sure you refreshed the job page.");
      }
    });
  }
});

// --- 🌐 LISTEN TO YOUR REACT DASHBOARD ---
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
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

// --- 🔄 RELAY FOR THE CONTENT SCRIPT ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveJob") {
    
    // Grab the user's token from storage
    chrome.storage.local.get(['token'], (result) => {
      const token = result.token;

      if (!token) {
        sendResponse({ error: "You are not logged in! Please open your Mirae Dashboard and log in." });
        return;
      }

      // Make the API call safely from the background
      fetch('http://localhost:5000/api/tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(request.data)
      })
      .then(res => {
        if (res.status === 401) throw new Error("Session expired. Please log in to your Mirae dashboard again.");
        if (!res.ok) throw new Error("Server rejected request. Check backend terminal.");
        return res.json();
      })
      .then(data => sendResponse({ success: true, data }))
      .catch(err => {
        sendResponse({ error: err.message || "Could not connect to Mirae Backend." });
      });
    });

    return true; 
  }
});
