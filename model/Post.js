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
    require: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now(),
  },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Post", PostsSchema);
