// 1. Dashboard Button (Now points to Vite port 5173!)
document.getElementById('dashboardBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: "http://localhost:5173/dashboard" }); 
});

// 2. The "Save Job" Button
document.getElementById('saveBtn').addEventListener('click', async () => {
  const saveBtn = document.getElementById('saveBtn');
  saveBtn.innerText = "Analyzing with AI...";
  saveBtn.style.opacity = "0.7";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { action: "triggerScrape" }, (response) => {
    setTimeout(() => {
      saveBtn.innerText = "✨ Save Job to Mirae";
      saveBtn.style.opacity = "1";
    }, 2000);
  });
});
