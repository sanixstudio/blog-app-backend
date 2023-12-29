const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/multer");

// GET ALL POSTS
router.get("/posts", async (req, res, next) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// GET SINGLE POST
router.get("/posts/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// GET ALL POSTS FOR AUTHOR ONLY
router.get("/posts/user-posts/:id", authenticate, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ author: userId }).populate(
      "author",
      "username"
    );

    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// CREATE POST
router.post(
  "/posts",
  authenticate,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
        author: req.body.userId,
      });

      // Handle the image upload if a file was provided
      if (req.file) {
        const imageStream = streamifier.createReadStream(req.file.buffer);

        // Upload the image to Cloudinary using a stream
        const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) {
              return res.status(500).json({ error: "Image upload failed" });
            }

            // Save the public URL of the Cloudinary image to your Post schema
            newPost.image = {
              url: result.secure_url, // Retrieve the public URL from Cloudinary's response
            };

            // Save the new post with the image URL to the database
            newPost.save((err, post) => {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Failed to save post with image" });
              }
              res.status(201).json(post);
            });
          }
        );

        // Pipe the imageStream to the Cloudinary upload stream
        imageStream.pipe(cloudinaryUploadStream);
      } else {
        // If no image was uploaded, save the post without an image URL
        const post = await newPost.save();
        res.status(201).json(post);
      }
    } catch (err) {
      next(err);
    }
  }
);

// UPDATE POST
router.put("/posts/:id", authenticate, async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

// DELETE POST
router.delete("/posts/:id", authenticate, async (req, res, next) => {
  try {
    const post = await Post.findByIdAndRemove(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(201).json({ message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
