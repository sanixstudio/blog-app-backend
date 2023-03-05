const express = require("express");
const { body, validationResult } = require("express-validator");
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
router.post(
  "/register",
  body("username")
    .notEmpty()
    .withMessage("Please fill out the form")
    .isLength({ min: 3, max: 16 })
    .withMessage(
      "username must be at least 3 characters long and max 16 characters"
    ),
  body("password")
    .notEmpty()
    .withMessage("Please fill out the form")
    .isLength({ min: 3, max: 64 })
    .withMessage(
      "username must be at least 3 characters long and max 24 characters"
    ),
  async (req, res) => {
    const { username, password } = req.body;
    const errors = validationResult(req);

    try {
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const newUser = await User.create({
        username,
        password: bcrypt.hashSync(password, salt),
      });
      res.status(200).json(newUser);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
);

// LOGIN
router.post(
  "/login",
  body("username").notEmpty().withMessage("Please fill out the form"),
  body("password").notEmpty().withMessage("Please fill out the form"),
  async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(401).json({ message: "Please complete the form" });
      return;
    }

    try {
      const userDoc = await User.findOne({ username });

      if (!userDoc) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      const isPassOk = await bcrypt.compare(password, userDoc.password);

      if (isPassOk) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json("ok");
        });
      } else {
        res.status(400).json({ message: "Invalid password" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
