// content.js

// 1. Helper function to safely grab text
const getTextBySelector = (selectors) => {
  for (let selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.innerText.trim() !== '') {
      return element.innerText.trim();
    }
  }
  return "Could not detect";
};

// 2. The main scraping logic
const scrapeJobDetails = async () => {
  console.log("Mirae Scraper: Starting extraction...");

  const jobTitle = getTextBySelector([
    'h1.top-card-layout__title', '.t-24.t-bold', 'h1', '.job-title'
  ]);

  const companyName = getTextBySelector([
    '.topcard__org-name-link', '.job-details-jobs-unified-top-card__company-name', '[data-cy="company-name"]', '.company-name'
  ]);

  const jobDescription = getTextBySelector([
    '.description__text', '.jobs-description__content', '#job-description', 'main', 'body'
  ]);

  const jobData = {
    title: jobTitle,
    company: companyName,
    url: window.location.href,
    description: jobDescription.substring(0, 3000) 
  };

  console.log("Mirae Scraper: Extracted data, sending to server...", jobData);

  // 3. Send the data to your new Node.js backend
  try {
    const response = await fetch('http://localhost:5000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    const result = await response.json();

    if (response.ok) {
      // Show a success alert if the backend says "201 Created"
      alert(`✅ Success! Added "${jobData.title}" at ${jobData.company} to your Mirae pipeline.`);
    } else {
      // Show an error if the backend rejected it
      console.error("Backend Error:", result);
      alert(`❌ Failed to save job: ${result.error}`);
    }

  } catch (error) {
    console.error("Network Error:", error);
    alert("❌ Could not connect to Mirae Server. Make sure your Node backend is running!");
  }
};

// 4. Run the function immediately
scrapeJobDetails();
