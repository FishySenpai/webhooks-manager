const { generateHmac } = require("./hmac");
const { retryWebhook } = require("./retry");
const fs = require("fs");

const dbFile = "./db.json";

// Trigger webhooks for a specific event
const triggerWebhooks = async (event, data, secret = "my_secret") => {
  const webhooks = JSON.parse(fs.readFileSync(dbFile, "utf8"));

  for (const id in webhooks) {
    if (webhooks[id].event === event) {
      const payload = { data, timestamp: new Date() };
      const hmac = generateHmac(secret, payload);

      try {
        await retryWebhook(webhooks[id].url, { ...payload, hmac });
      } catch (error) {
        console.error(`Failed to send webhook to ${webhooks[id].url}`);
      }
    }
  }
};

module.exports = { triggerWebhooks };
