const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortBio: { type: String, required: true },
  fullBio: { type: String, required: true },
  profileImageUrl: { type: String, default: null },
  education: [{ type: String }],
  certificates: [{ type: String }],
});

module.exports = mongoose.model("About", AboutSchema);
