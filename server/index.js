const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const Message = require("./models/Message.js");
const Knowledge = require("./models/Knowledge.js");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Chatbot server is running!" });
})

const knowledgeBase = [
  {
    topic: "wealth",
    keywords: ["wealth", "money", "rich", "startup", "business"],
    answer:
      "Naval often talks about wealth as something you build through ownership, leverage, specific knowledge, and long-term thinking. The idea is not just to trade time for money, but to build assets that can work while you sleep.",
  },
  {
    topic: "leverage",
    keywords: ["leverage", "code", "media", "internet", "scale"],
    answer:
      "A Naval-inspired view of leverage is: use tools like code, media, capital, and people to multiply your effort. Code and media are especially powerful because they can work for you even when you are not actively working.",
  },
  {
    topic: "happiness",
    keywords: ["happy", "happiness", "peace", "anxiety", "mind"],
    answer:
      "A Naval-inspired answer: happiness is not about getting every external thing you want. It is often about reducing desire, observing your thoughts, and finding peace in the present.",
  },
  {
    topic: "specific knowledge",
    keywords: ["specific knowledge", "skill", "career", "learn"],
    answer:
      "Specific knowledge is knowledge that feels natural to you, is hard for others to copy, and is built through curiosity, obsession, and experience. It is usually not something you learn only from school.",
  },
  {
    topic: "long term",
    keywords: ["long term", "patience", "compound", "relationship"],
    answer:
      "A Naval-style principle: play long-term games with long-term people. Compounding works in money, knowledge, reputation, and relationships.",
  },
];

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

async function getBotReply(message) {
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

    const knowledgeItems = await Knowledge.find()

    const matchedKnowlege = knowledgeItems.find((item) => {

      const topicMatch = text.includes(item.topic.toLowerCase());

      const keywordMatch = item.keywords.some((keyword) => text.includes(keyword.toLowerCase()));

      const contentMatch = item.text.toLowerCase().includes(text);

      return topicMatch || keywordMatch || contentMatch;
    });

    const matchedIntent = intents.find((intent) => {
        return intent.keywords.some((keyword) => text.includes(keyword));
    });

    if(matchedKnowlege) {
      return matchedKnowlege.text;
    }

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

    const botAnswer = await getBotReply(userMessage);

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