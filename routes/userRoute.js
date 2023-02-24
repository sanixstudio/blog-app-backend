const express = require("express");
const router = express.Router();
const User = require("../model/User");

router.get("/", (req, res) => {
  res.send("Getting user");
});

router.post("/register", (req, res) => {
  res.send("Registering...");
});

router.post("/login", async (req, res) => {
  res.send("Logging in...");
});

module.exports = router;
