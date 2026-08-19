"use client";

import { useState } from "react";

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");

  const generateQR = () => {
    if (!text.trim()) {
      alert("Please enter text or a URL first.");
      return;
    }

    const encodedText = encodeURIComponent(text.trim());

    const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodedText}`;

    setQrUrl(url);
  };

  const clearQR = () => {
    setText("");
    setQrUrl("");
  };

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <a href="/" style={styles.back}>
          ← Back to KaamKit
        </a>

        <h1 style={styles.title}>QR Generator</h1>

        <p style={styles.subtitle}>
          Generate QR codes for text, links and other information.
        </p>

        <div style={styles.card}>
          <label style={styles.label}>
            Enter Text or URL
          </label>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text, website URL, phone number, etc."
            style={styles.textarea}
            rows={5}
          />

          <button onClick={generateQR} style={styles.generateButton}>
            Generate QR Code
          </button>

          {qrUrl && (
            <div style={styles.result}>
              <h2 style={styles.resultTitle}>Your QR Code</h2>

              <div style={styles.qrBox}>
                <img
                  src={qrUrl}
                  alt="Generated QR Code"
                  style={styles.qrImage}
                />
              </div>

              <a
                href={qrUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.downloadButton}
              >
                Download QR →
              </a>

              <button onClick={clearQR} style={styles.clearButton}>
                Clear
              </button>
            </div>
          )}
        </div>

        <p style={styles.footer}>
          KaamKit — Free online tools for everyday work.
        </p>
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    background: "#f7f8fa",
    padding: "30px 20px",
    fontFamily: "Arial, sans-serif",
    color: "#111827",
  },

  container: {
    maxWidth: "600px",
    margin: "0 auto",
  },

  back: {
    color: "#111827",
    textDecoration: "none",
    fontWeight: "600",
  },

  title: {
    fontSize: "36px",
    margin: "30px 0 10px",
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "17px",
    marginBottom: "30px",
    lineHeight: "1.5",
  },

  card: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },

  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "10px",
    fontSize: "17px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    resize: "vertical",
    outline: "none",
  },

  generateButton: {
    width: "100%",
    marginTop: "18px",
    padding: "15px",
    borderRadius: "10px",
    border: "none",
    background: "#111827",
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "600",
    cursor: "pointer",
  },

  result: {
    marginTop: "30px",
    textAlign: "center",
  },

  resultTitle: {
    fontSize: "22px",
    marginBottom: "20px",
  },

  qrBox: {
    display: "flex",
    justifyContent: "center",
    padding: "15px",
    background: "#ffffff",
  },

  qrImage: {
    width: "280px",
    maxWidth: "100%",
    height: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },

  downloadButton: {
    display: "block",
    marginTop: "20px",
    padding: "14px",
    borderRadius: "10px",
    background: "#111827",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "600",
  },

  clearButton: {
    width: "100%",
    marginTop: "10px",
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    fontWeight: "600",
  },

  footer: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: "35px",
    fontSize: "14px",
  },
};
