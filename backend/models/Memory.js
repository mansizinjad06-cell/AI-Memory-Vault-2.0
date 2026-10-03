const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["photo", "note", "document", "voice"],
      required: true,
    },

    title: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    fileName: {
      type: String,
      default: "",
    },

    fileData: {
      type: String,
      default: "",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Memory", memorySchema);