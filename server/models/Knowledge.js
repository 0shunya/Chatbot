const mongoose = require("mongoose");

const knowledgeSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      required: true,
      unique: true,
    },
    text: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: "unknown",
    },
    topic: {
      type: String,
      default: "general",
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Knowledge", knowledgeSchema);