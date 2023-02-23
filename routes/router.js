const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json("Hello from server....");
});

router.post("/register", (req, res) => {
  res.json("Hello from server");
});

router.post("/login", (req, res) => {
  res.json("Hello from server");
});

module.exports = router;
