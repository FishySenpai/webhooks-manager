const express = require("express");
const bodyParser = require("body-parser");
const webhooksRouter = require("./routes/webhooks");
const { triggerWebhooks } = require("./utils/trigger");

const app = express();
app.use(bodyParser.json());

// Webhooks API
app.use("/webhooks", webhooksRouter);

// Test event
app.post("/trigger/:event", async (req, res) => {
  const { event } = req.params;
  const payload = req.body;

  await triggerWebhooks(event, payload);
  res.status(200).json({ message: `Triggered event: ${event}` });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
