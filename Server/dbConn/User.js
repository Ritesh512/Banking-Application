const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  addcard: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: true,
  },
  mob: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profilePassword:{
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("users", userSchema);
