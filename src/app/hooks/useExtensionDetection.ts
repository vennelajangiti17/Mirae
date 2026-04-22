// src/app/hooks/useExtensionDetection.ts

export const checkExtension = async () => {
  // Replace with your actual local Extension ID (found in chrome://extensions)
  const EXTENSION_ID = "YOUR_EXTENSION_ID_HERE"; 

  return new Promise((resolve) => {
    if (!window.chrome || !window.chrome.runtime) {
      resolve(false);
      return;
    }

    // Ping the extension
    window.chrome.runtime.sendMessage(EXTENSION_ID, { message: "ping" }, (response) => {
      if (window.chrome.runtime.lastError) {
        resolve(false); // Extension not found
      } else {
        resolve(response?.status === "online");
      }
    });
  });
};
