const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Örn: Online Terapi
  description: { type: String, default: "" }, // Detay açıklama (varsa)
  related: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogPost",
    required: true,
  },
});

module.exports = mongoose.model("Service", ServiceSchema);
