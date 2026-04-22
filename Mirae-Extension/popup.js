// popup.js
document.getElementById('dashboardBtn').addEventListener('click', () => {
  // Opens your local React dashboard in a new tab
  // Change port 3000 if your React app runs on a different port!
  chrome.tabs.create({ url: "http://localhost:3000" }); 
});
