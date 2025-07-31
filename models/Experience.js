const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  institution: { type: String },
  description: { type: String },
});

module.exports = mongoose.model("Experience", ExperienceSchema);
