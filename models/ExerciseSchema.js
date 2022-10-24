const mongoose = require("mongoose");

const exerciseSchema = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: String,
  duration: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
