const mongoose = require("mongoose");

const customizeSchema = new mongoose.Schema(
  {
    photos: {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    firstShow: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const customizeModel = mongoose.model("customizes", customizeSchema);
module.exports = customizeModel;
