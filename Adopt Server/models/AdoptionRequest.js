const mongoose = require("mongoose");

const adoptionRequestSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
    petName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdoptionRequest", adoptionRequestSchema);
