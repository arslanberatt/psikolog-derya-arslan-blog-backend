const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Örn: Online Terapi
  description: { type: String, default: "" }, // Detay açıklama (varsa)
});

module.exports = mongoose.model("Service", ServiceSchema);
