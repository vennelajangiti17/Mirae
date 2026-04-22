// background.js

// 1. Create the right-click menu item when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToMirae",
    title: "Save to Mirae",
    contexts: ["page", "selection"] // Shows up when right-clicking the page or highlighted text
  });
});

// 2. Listen for when the user clicks that specific menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToMirae") {
    
    // 3. Inject and run the content.js script inside the active tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    }).catch(error => {
      console.error("Mirae Error: Could not inject scraper script.", error);
    });
    
  }
});
