const axios = require("axios");

const retryWebhook = async (url, payload, maxRetries = 5) => {
  let retries = 0;
  let delay = 1000;

  while (retries < maxRetries) {
    try {
      await axios.post(url, payload);
      console.log(`Webhook sent successfully to ${url}`);
      return;
    } catch (error) {
      retries++;
      console.error(`Retry ${retries}: Failed to send webhook to ${url}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }

  console.error(`Webhook failed after ${maxRetries} retries`);
};
