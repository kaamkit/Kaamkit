"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    if (!text.trim()) {
      alert("Please enter text or a URL.");
      return;
    }

    try {
      setLoading(true);

      const dataUrl = await QRCode.toDataURL(text.trim(), {
        width: 600,
        margin: 3,
        errorCorrectionLevel: "H",
      });

      setQrCode(dataUrl);
    } catch (error) {
      console.error(error);
      alert("Unable to generate QR code.");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;

    const link = document.createElement("a");

    link.href = qrCode;
    link.download = "kaamkit-qr-code.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetQR = () => {
    setText("");
    setQrCode("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f8ff",
        color: "#14213d",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5edf7",
          padding: "16px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
                color: "#ffffff",
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
            ▦
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "38px",
            }}
          >
            QR Code Generator
          </h1>

          <p
            style={{
              margin: 0,
              color: "#718096",
              fontSize: "17px",
            }}
          >
            Create a QR code for any text, website or link.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
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
              marginBottom: "8px",
            }}
          >
            Enter Text or URL
          </label>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com"
            rows={5}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontSize: "16px",
              resize: "vertical",
              outline: "none",
            }}
          />

          <button
            type="button"
            onClick={generateQR}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "16px",
              border: "none",
              borderRadius: "12px",
              background: "#1677ff",
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: "700",
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Generating..." : "Generate QR Code →"}
          </button>

          {qrCode && (
            <div
              style={{
                marginTop: "30px",
                paddingTop: "25px",
                borderTop: "1px solid #e5edf7",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "18px",
                  fontSize: "22px",
                }}
              >
                Your QR Code
              </h2>

              <div
                style={{
                  display: "inline-block",
                  background: "#ffffff",
                  padding: "15px",
                  borderRadius: "15px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <img
                  src={qrCode}
                  alt="Generated QR Code"
                  style={{
                    display: "block",
                    width: "280px",
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginTop: "22px",
                }}
              >
                <button
                  type="button"
                  onClick={downloadQR}
                  style={{
                    padding: "14px 22px",
                    border: "none",
                    borderRadius: "12px",
                    background: "#1677ff",
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Download PNG ↓
                </button>

                <button
                  type="button"
                  onClick={resetQR}
                  style={{
                    padding: "14px 22px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "12px",
                    background: "#ffffff",
                    color: "#14213d",
                    fontWeight: "700",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "16px",
              textAlign: "center",
              border: "1px solid #e5edf7",
            }}
          >
            <div style={{ fontSize: "28px" }}>⚡</div>
            <strong
              style={{
                display: "block",
                marginTop: "8px",
              }}
            >
              Instant
            </strong>
            <small>Generate QR codes quickly</small>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "16px",
              textAlign: "center",
              border: "1px solid #e5edf7",
            }}
          >
            <div style={{ fontSize: "28px" }}>🛡️</div>
            <strong
              style={{
                display: "block",
                marginTop: "8px",
              }}
            >
              Private
            </strong>
            <small>Generated directly in browser</small>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "16px",
              textAlign: "center",
              border: "1px solid #e5edf7",
            }}
          >
            <div style={{ fontSize: "28px" }}>💯</div>
            <strong
              style={{
                display: "block",
                marginTop: "8px",
              }}
            >
              Free
            </strong>
            <small>No signup required</small>
          </div>
        </div>
      </section>
    </main>
  );
              }
