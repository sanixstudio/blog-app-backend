const express = require("express");
const router = express.Router();
const User = require("../model/User");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

router.get("/", (req, res) => {
  res.send("Getting user");
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  console.log(bcrypt.hashSync(password, salt));

  if (!username || !password)
    res.status(400).json("Please complete the form before submitting");

  try {
    const newUser = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.status(200).json(newUser);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

router.post("/login", async (req, res) => {
  res.send("Logging in...");
});

module.exports = router;
