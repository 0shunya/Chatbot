const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const Message = require("./models/Message.js");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Chatbot server is running!" });
})

const intents = [
  {
    name: "greeting",
    keywords: ["hello", "hi", "hey"],
    answer: "Hello! How can I help you?",
  },
  {
    name: "wellbeing",
    keywords: ["how are you", "how r u"],
    answer: "I am doing good! Thanks for asking.",
  },
  {
    name: "identity",
    keywords: ["your name", "who are you", "what are you"],
    answer: "I am MiniBot, built with Node.js, Express, MongoDB, and React.",
  },
  {
    name: "goodbye",
    keywords: ["bye", "goodbye", "see you"],
    answer: "Goodbye! Talk to you later.",
  },
  {
    name: "help",
    keywords: ["help", "what can you do"],
    answer: "I can chat with you, save messages, and remember chat history using MongoDB.",
  },
];

function getBotReply(message) {
    const text = message.toLowerCase().trim()

    // if(text.includes("hello") || text.includes("hi")) {
    //     return "Hello How can I help you";
    // }

    // if(text.includes("how are you")) {
    //     return "I am doing good! Thanks for asking"
    // }
    // if(text.includes("whats your name?")) {
    //     return "I am Mini Bot, built with node js and React"
    // }
    // if(text.includes("bubbye")) {
    //     return "Goodbye! Talk to you later."
    // }

    const matchedIntent = intents.find((intent) => {
        return intent.keywords.some((keywords) => text.includes(keywords));
    });

    if(matchedIntent){
        return matchedIntent.answer;
    }

    return "I don't think I understand that yet. can you try another question?"
}

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({
            error: "Message is required",
        });
    }

    const botAnswer = getBotReply(userMessage);

    await Message.create({
        userMessage: userMessage,
        botAnswer: botAnswer,
    })

    res.json({
        answer: botAnswer,
    })
});

app.get("/api/messages",  async (req, res) => {
    const messages = await Message.find().sort({ createdAt: 1 });

    res.json(messages);
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(5000, () => {
      console.log("Server running at http://localhost:5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });