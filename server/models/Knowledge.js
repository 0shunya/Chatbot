const mongoose = require("mongoose");

const knowledgeSchema = new mongoose.Schema(
    {
        topic: {
            type: String,
            required: true,
        },
        keyword: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        }
    },
        {
            timestamps: true
        }
);

module.exports = mongoose.model("Knowledge", knowledgeSchema);