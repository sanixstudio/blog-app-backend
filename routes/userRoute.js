const express = require("express");
const router = express.Router();
const User = require("../model/User");

const jwt = require("jsonwebtoken");
const secret = "some_Sort@ofString&";

const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

router.get("/", (req, res) => {
  res.send("Getting user");
});

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    res.status(400).json("Please complete the form before submitting");

  try {
    const newUser = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.status(200).json(newUser);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, {}, (err, token) => {
      if (err) throw err;
      res.json(token);
    });
  } else res.status(400).json("Wrong credentials");
});

module.exports = router;
