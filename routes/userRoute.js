const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");
const createSecretToken = require("../utils/secretToken");
const upload = require("../middleware/multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/", (req, res) => {
  res.send("Getting user");
});

// REGISTER
router.post("/register", upload.single("image"), async (req, res) => {
  const { username, password } = req.body;
  const errors = validationResult(req);

  try {
    let userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User({
      username,
      password: hashedPassword,
    });

    if (req.file) {
      const imageStream = streamifier.createReadStream(req.file.buffer);

      // Upload the image to Cloudinary using a stream
      const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed" });
          }

          // Save the public URL of the Cloudinary image to your Post schema
          newUser.image = {
            url: result.secure_url, // Retrieve the public URL from Cloudinary's response
          };

          // Save the new post with the image URL to the database
          newUser.save((err, user) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Failed to save post with image" });
            }
            res.status(201).json(user);
          });
        }
      );

      // Pipe the imageStream to the Cloudinary upload stream
      imageStream.pipe(cloudinaryUploadStream);
    } else {
    }

    const payload = {
      user: {
        id: newUser._id,
      },
    };

    const token = createSecretToken(payload);

    res.status(201).json({
      token,
      user: { name: newUser.username, id: newUser._id, photo: newUser.image },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
        const token = createSecretToken(payload);
        res
          .status(201)
          .json({ token, user: { id: userDoc._id, name: userDoc.username } });
      } else {
        res.status(400).json({ message: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
