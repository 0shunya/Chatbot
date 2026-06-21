"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(event) {
    event.preventDefault();

    if (!message.trim())  return;

    const userMessage =  message;
    setMessage("");
    setLoading(true);

    setMessages((old) => [
      ...old,
      { sender: "user", text: userMessage },
    ]);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data =  await response.json();

      setMessages((old) => [
        ...old,
        { sender: "bot", text: data.answer },
      ]);
    } catch (error) {
      setMessages((old) => [
        ...old,
        { sender : "bot", text: "The server is unavailable."},
      ]);
    } finally {
      setLoading(false);
    }    
  }
return (
    <main style={styles.main}>
      <section style={styles.chat}>
        <h1>Mini Chatbot</h1>

        <div style={styles.messages}>
          {messages.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                alignSelf:
                  item.sender === "user" ? "flex-end" : "flex-start",
                background:
                  item.sender === "user" ? "#2563eb" : "#e5e7eb",
                color: item.sender === "user" ? "white" : "black",
              }}
            >
              {item.text}
            </div>
          ))}

          {loading && <p>Bot is thinking...</p>}
        </div>

        <form onSubmit={sendMessage} style={styles.form}>
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a message..."
            style={styles.input}
          />

          <button disabled={loading} style={styles.button}>
            Send
          </button>
        </form>
      </section>
    </main>
  );
}

const styles = {
  main: {
    display: "grid",
    placeItems: "center",
    minHeight: "100vh",
    background: "#f3f4f6",
  },
  chat: {
    width: "min(500px, 90%)",
    padding: "24px",
    background: "white",
    borderRadius: "12px",
  },
  messages: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minHeight: "350px",
    margin: "20px 0",
  },
  message: {
    maxWidth: "75%",
    padding: "10px 14px",
    borderRadius: "12px",
  },
  form: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "12px",
  },
  button: {
    padding: "12px 20px",
    cursor: "pointer",
  },
};