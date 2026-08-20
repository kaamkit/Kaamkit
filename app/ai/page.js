"use client";

import { useState } from "react";

export default function AITool() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!prompt.trim()) {
      alert("Please enter your question.");
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#f7f8fc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          KaamKit AI
        </h1>

        <p style={{ color: "#666", marginBottom: "25px" }}>
          Ask anything and get an AI-powered answer.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask your question here..."
          rows={6}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            fontSize: "16px",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={askAI}
          disabled={loading}
          style={{
            marginTop: "15px",
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "12px",
            background: loading ? "#999" : "#111827",
            color: "white",
            fontSize: "17px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {answer && (
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#f3f4f6",
              borderRadius: "12px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
            }}
          >
            <strong>AI Answer</strong>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </main>
  );
}
