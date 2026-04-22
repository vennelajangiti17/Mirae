// content.js
// This leaves a hidden "fingerprint" on any webpage the user visits
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

const scrapeAndSendToMirae = async () => {
  console.log("Mirae: Extracting page data...");

  const jobData = {
    title: getTextBySelector(['h1.top-card-layout__title', '.t-24.t-bold', 'h1', '.job-title']),
    company: getTextBySelector(['.topcard__org-name-link', '.job-details-jobs-unified-top-card__company-name', '[data-cy="company-name"]', '.company-name']),
    url: window.location.href,
    description: getTextBySelector(['.description__text', '.jobs-description__content', '#job-description', 'main', 'body']).substring(0, 4000)
  };

  // Prevent sending entirely empty data
  if (jobData.title === "Could not detect" && jobData.description.length < 50) {
    alert("❌ Mirae: Couldn't find enough job data on this page.");
    return;
  }

  console.log("Mirae: Data extracted. Sending to AI backend...", jobData);

  try {
    // 🔥 UPDATED HERE: Now points to the new /api/tracker route!
    const response = await fetch('http://localhost:5000/api/tracker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    const result = await response.json();

    if (response.ok) {
      // Pulling the match score directly from the backend response!
      alert(`✨ Success! "${jobData.title}" analyzed by AI and saved to Mirae with a Match Score of ${result.job.matchScore}%!`);
    } else {
      alert(`❌ Mirae Error: ${result.error}`);
    }

  } catch (error) {
    console.error("Mirae Network Error:", error);
    alert("❌ Could not connect to the Mirae Backend. Is your Node server running on port 5000?");
  }
};

scrapeAndSendToMirae();
