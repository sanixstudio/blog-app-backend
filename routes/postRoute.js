const express = require("express");
const router = express.Router();
const Post = require("../model/Post");

router.get("/posts", (req, res) => {
    res.send("Posts...");
  });

  router.post("/post/:id", async (req, res) => {
    res.send("Logging in...");
  });
  
  module.exports = router;
  