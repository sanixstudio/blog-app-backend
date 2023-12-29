const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 16,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 3,
    max: 32,
  },
  photo: {
    url: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
