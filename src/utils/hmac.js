const crypto = require("crypto");

const generateHmac = (secret, payload) => {
  return crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");
};

module.exports = { generateHmac };
