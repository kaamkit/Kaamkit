"use client";

import { useState } from "react";

export default function GSTCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState("exclusive");

  const value = parseFloat(amount) || 0;
  const gstRate = parseFloat(rate) || 0;

  let baseAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (mode === "exclusive") {
    baseAmount = value;
    gstAmount = (value * gstRate) / 100;
    totalAmount = value + gstAmount;
  } else {
    totalAmount = value;
    baseAmount = value / (1 + gstRate / 100);
    gstAmount = value - baseAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <a href="/" style={styles.back}>
          ← Back to KaamKit
        </a>

        <h1 style={styles.title}>GST Calculator</h1>

        <p style={styles.subtitle}>
          Calculate GST, CGST, SGST and total amount quickly.
        </p>

        <div style={styles.card}>
          <label style={styles.label}>Amount (₹)</label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            style={styles.input}
          />

          <label style={styles.label}>GST Rate</label>

          <select
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            style={styles.input}
          >
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </select>

          <label style={styles.label}>Calculation Type</label>

          <div style={styles.modeBox}>
            <button
              onClick={() => setMode("exclusive")}
              style={
                mode === "exclusive"
                  ? styles.activeMode
                  : styles.modeButton
              }
            >
              GST Extra
            </button>

            <button
              onClick={() => setMode("inclusive")}
              style={
                mode === "inclusive"
                  ? styles.activeMode
                  : styles.modeButton
              }
            >
              GST Included
            </button>
          </div>

          <div style={styles.result}>
            <div style={styles.row}>
              <span>Base Amount</span>
              <strong>₹{baseAmount.toFixed(2)}</strong>
            </div>

            <div style={styles.row}>
              <span>GST ({gstRate}%)</span>
              <strong>₹{gstAmount.toFixed(2)}</strong>
            </div>

            <div style={styles.row}>
              <span>CGST</span>
              <strong>₹{cgst.toFixed(2)}</strong>
            </div>

            <div style={styles.row}>
              <span>SGST</span>
              <strong>₹{sgst.toFixed(2)}</strong>
            </div>

            <div style={styles.totalRow}>
              <span>Total Amount</span>
              <strong>₹{totalAmount.toFixed(2)}</strong>
            </div>
          </div>
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
    marginBottom: "8px",
    marginTop: "18px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    background: "#ffffff",
  },

  modeBox: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  modeButton: {
    flex: 1,
    padding: "13px 8px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    fontWeight: "600",
  },

  activeMode: {
    flex: 1,
    padding: "13px 8px",
    borderRadius: "10px",
    border: "none",
    background: "#111827",
    color: "#ffffff",
    fontWeight: "600",
  },

  result: {
    marginTop: "25px",
    padding: "18px",
    background: "#f3f4f6",
    borderRadius: "12px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #e5e7eb",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 0 5px",
    fontSize: "20px",
  },

  footer: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: "35px",
    fontSize: "14px",
  },
};
