const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const fs = require("fs");

const dbFile = "./db.json"; // File to store webhooks

// Load webhooks from file
const loadWebhooks = () => {
  if (fs.existsSync(dbFile)) {
    return JSON.parse(fs.readFileSync(dbFile, "utf8"));
  }
  return {};
};

// Save webhooks to file
const saveWebhooks = (data) => {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
};

// Get all webhooks
router.get("/", (req, res) => {
  const webhooks = loadWebhooks();
  res.json(webhooks);
});

// Register a new webhook
router.post("/", (req, res) => {
  const { url, event } = req.body;

  if (!url || !event) {
    return res.status(400).json({ error: "URL and event are required" });
  }

  const webhooks = loadWebhooks();
  const id = uuidv4();
  webhooks[id] = { url, event, createdAt: new Date() };

  saveWebhooks(webhooks);
  res.status(201).json({ id });
});

// Delete a webhook
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const webhooks = loadWebhooks();

  if (!webhooks[id]) {
    return res.status(404).json({ error: "Webhook not found" });
  }

  delete webhooks[id];
  saveWebhooks(webhooks);
  res.status(204).send();
});

module.exports = router;
