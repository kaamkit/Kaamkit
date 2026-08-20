"use client";

import { useState } from "react";

export default function GSTCalculator() {
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [mode, setMode] = useState("add");

  const amountValue = Number(amount) || 0;
  const rateValue = Number(gstRate) || 0;

  let baseAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (mode === "add") {
    baseAmount = amountValue;
    gstAmount = (amountValue * rateValue) / 100;
    totalAmount = amountValue + gstAmount;
  } else {
    totalAmount = amountValue;
    baseAmount = amountValue / (1 + rateValue / 100);
    gstAmount = amountValue - baseAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  const money = (value) =>
    value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const resetCalculator = () => {
    setAmount("");
    setGstRate("18");
    setMode("add");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f8ff",
        fontFamily: "Arial, sans-serif",
        color: "#14213d",
      }}
    >
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5edf7",
          padding: "16px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <a
            href="/"
            style={{
              textDecoration: "none",
              color: "#14213d",
              fontSize: "24px",
              fontWeight: "800",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "#1677ff",
                color: "#fff",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
              }}
            >
              K
            </span>
            Kaam<span style={{ color: "#1677ff" }}>Kit</span>
          </a>

          <a
            href="/"
            style={{
              textDecoration: "none",
              color: "#1677ff",
              fontWeight: "700",
            }}
          >
            ← Home
          </a>
        </div>
      </header>

      <section
        style={{
          maxWidth: "850px",
          margin: "auto",
          padding: "45px 20px 70px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "75px",
              height: "75px",
              margin: "0 auto 15px",
              borderRadius: "20px",
              background: "#e7f1ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            ₹
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "38px",
            }}
          >
            GST Calculator
          </h1>

          <p
            style={{
              margin: 0,
              color: "#718096",
              fontSize: "17px",
            }}
          >
            Calculate GST, CGST, SGST and final amount instantly.
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "28px",
            border: "1px solid #e4ecf7",
            boxShadow: "0 15px 45px rgba(30,80,140,.10)",
          }}
        >
          <label
            style={{
              display: "block",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            Calculation Type
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "25px",
            }}
          >
            <button
              type="button"
              onClick={() => setMode("add")}
              style={{
                padding: "15px",
                borderRadius: "12px",
                border:
                  mode === "add"
                    ? "2px solid #1677ff"
                    : "1px solid #cbd5e1",
                background:
                  mode === "add" ? "#e8f2ff" : "#fff",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Add GST
            </button>

            <button
              type="button"
              onClick={() => setMode("remove")}
              style={{
                padding: "15px",
                borderRadius: "12px",
                border:
                  mode === "remove"
                    ? "2px solid #1677ff"
                    : "1px solid #cbd5e1",
                background:
                  mode === "remove" ? "#e8f2ff" : "#fff",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Remove GST
            </button>
          </div>

          <label
            style={{
              display: "block",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            {mode === "add"
              ? "Amount Before GST"
              : "Amount Including GST"}
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontSize: "17px",
              marginBottom: "20px",
            }}
          />

          <label
            style={{
              display: "block",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            GST Rate
          </label>

          <select
            value={gstRate}
            onChange={(e) => setGstRate(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontSize: "17px",
              marginBottom: "25px",
              background: "#fff",
            }}
          >
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </select>

          <div
            style={{
              background: "#f5f9ff",
              borderRadius: "18px",
              padding: "22px",
              border: "1px solid #dce9f8",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "18px",
                fontSize: "21px",
              }}
            >
              Calculation Result
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <span>Base Amount</span>
              <strong>₹{money(baseAmount)}</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <span>GST ({rateValue}%)</span>
              <strong>₹{money(gstAmount)}</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <span>CGST ({rateValue / 2}%)</span>
              <strong>₹{money(cgst)}</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <span>SGST ({rateValue / 2}%)</span>
              <strong>₹{money(sgst)}</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "18px",
                fontSize: "21px",
                fontWeight: "800",
                color: "#1677ff",
              }}
            >
              <span>
                {mode === "add"
                  ? "Final Amount"
                  : "Original Amount"}
              </span>

              <span>₹{money(totalAmount)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={resetCalculator}
            style={{
              width: "100%",
              marginTop: "22px",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              background: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Reset Calculator
          </button>
        </div>
      </section>
    </main>
  );
}
