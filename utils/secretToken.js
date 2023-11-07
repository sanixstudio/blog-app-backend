require("dotenv").config();
const jwt = require("jsonwebtoken");

const createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60, // Three Days
  });
};

module.exports = createSecretToken;
