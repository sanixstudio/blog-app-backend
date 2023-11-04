const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/", (req, res) => {
  res.send("Getting user");
});

// REGISTER
router.post(
  "/register",
  [
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
        "password must be at least 3 characters long and max 64 characters"
      ),
  ],
  async (req, res) => {
    const { username, password } = req.body;
    const errors = validationResult(req);

    try {
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let userExists = await User.findOne({ username });
      if (userExists) {
        return res.status(400).json({ message: "Username is already taken" });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await User.create({
        username,
        password: hashedPassword,
      });

      const payload = {
        user: {
          id: newUser._id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 604800 }, // Token expires in 7 days
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token: token, user: newUser.username });
        }
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// LOGIN
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Please fill out the form"),
    body("password").notEmpty().withMessage("Please fill out the form"),
  ],
  async (req, res) => {
    const { username, password } = req.body;
    const errors = validationResult(req);

    try {
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userDoc = await User.findOne({ username });

      if (!userDoc) {
        return res.status(400).json({ message: "User not found" });
      }

      const isPassOk = await bcrypt.compare(password, userDoc.password);

      const payload = {
        user: {
          id: userDoc._id,
        },
      };

      if (isPassOk) {
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 604800 }, // Token expires in 7 days
          (err, token) => {
            if (err) throw err;
            res.status(201).json({ token: token, user: userDoc.username });
          }
        );
      } else {
        res.status(400).json({ message: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
