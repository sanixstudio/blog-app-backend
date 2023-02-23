const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    require: true
  },
  createdAt: timeStamp
});

module.exports = mongoose.model("Post", PostsSchema);
