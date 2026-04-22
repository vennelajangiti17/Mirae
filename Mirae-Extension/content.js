// Leaves a hidden "fingerprint" on the webpage
document.documentElement.setAttribute('data-mirae-installed', 'true');

const getTextBySelector = (selectors) => {
  for (let selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.innerText.trim() !== '') {
      return element.innerText.trim();
    }
  }
  return "Could not detect";
};

const scrapeAndSendToMirae = () => {
  const jobData = {
    title: getTextBySelector(['h1.top-card-layout__title', '.t-24.t-bold', 'h1', '.job-title']),
    company: getTextBySelector(['.topcard__org-name-link', '.job-details-jobs-unified-top-card__company-name', '[data-cy="company-name"]', '.company-name']),
    url: window.location.href,
    description: getTextBySelector(['.description__text', '.jobs-description__content', '#job-description', 'main', 'body']).substring(0, 4000)
  };

  if (jobData.title === "Could not detect" && jobData.description.length < 50) {
    alert("❌ Mirae: Couldn't find enough job data on this page.");
    return;
  }

  // Send data to the background script instead of fetching directly
  chrome.runtime.sendMessage(
    { action: "saveJob", data: jobData },
    (response) => {
      if (chrome.runtime.lastError) {
        alert("❌ Mirae Error: Extension disconnected. Please refresh the page and try again.");
        return;
      }

      if (response && response.success) {
        alert(`✨ Success! "${jobData.title}" analyzed by AI and saved to Mirae with a Match Score of ${response.data.job.matchScore}%!`);
      } else {
        alert(`❌ Mirae Error: ${response ? response.error : 'Unknown error occurred.'}`);
      }
    }
  );
};

// 👂 Listen for the trigger from either the Popup or the Right-Click Menu
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "triggerScrape") {
    scrapeAndSendToMirae();
    sendResponse({ status: "scraping_started" });
  }
  return true;
});
