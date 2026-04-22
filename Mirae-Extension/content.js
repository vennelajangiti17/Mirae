// content.js

// 1. A helper function to safely grab text from the DOM without crashing if it doesn't exist
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
const scrapeJobDetails = () => {
  console.log("Mirae Scraper: Starting extraction...");

  // Try common selectors for Job Titles (usually the biggest heading on the page)
  const jobTitle = getTextBySelector([
    'h1.top-card-layout__title', // LinkedIn logged out
    '.t-24.t-bold',              // LinkedIn logged in
    'h1',                        // Generic fallback: The main heading
    '.job-title'                 // Common generic class
  ]);

  // Try common selectors for Company Names
  const companyName = getTextBySelector([
    '.topcard__org-name-link',   // LinkedIn logged out
    '.job-details-jobs-unified-top-card__company-name', // LinkedIn logged in
    '[data-cy="company-name"]',  // Common data attribute
    '.company-name'              // Common generic class
  ]);

  // Grab the job description (we grab a large chunk of text to send to the AI later)
  // We look for common main-content wrappers to avoid scraping the website's footer/nav bar
  const jobDescription = getTextBySelector([
    '.description__text',        // LinkedIn
    '.jobs-description__content',// LinkedIn logged in
    '#job-description',          // Generic ID
    'main',                      // HTML5 main content tag
    'body'                       // Absolute fallback: grab everything
  ]);

  // Bundle it all up!
  const jobData = {
    title: jobTitle,
    company: companyName,
    url: window.location.href,
    description: jobDescription.substring(0, 3000) // Limit to 3000 chars so we don't overload the backend
  };

  console.log("Mirae Scraper: Successfully extracted data!", jobData);

  // 3. Send this data back to background.js or show an alert for now
  alert(`🌟 Mirae Scraper Success! \n\nRole: ${jobData.title}\nCompany: ${jobData.company}\n\nCheck the console to see the full scraped data!`);

  return jobData;
};

// 4. Run the function immediately when the script is injected
scrapeJobDetails();
