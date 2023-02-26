const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 16,
  },
  password: {
    type: String,
    required: true,
    min: 3,
    max: 32,
  },
});

module.exports = mongoose.model("User", UserSchema);
