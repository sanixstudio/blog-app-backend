const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

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
        author: req.body.userId, // Set the author to the authenticated user
      });

      // Handle the image upload if a file was provided
      if (req.file) {
        newPost.image = {
          name: req.file.originalname,
          img: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          },
        };
      }

      console.log(newPost.image);

      const post = await newPost.save();
      res.status(201).json(post);
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
