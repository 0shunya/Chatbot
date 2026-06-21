const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Chatbot server is running!" });
})


app.post("/api/chat", (req, res) => {
    const userMessage = req.body.message;

    res.json({
        answer: `You said: ${userMessage}`
    });
});

app.listen(5000, () => {
    console.log("server is running");
})