"use client";

import { useRef, useState } from "react";
import { createWorker } from "tesseract.js";

export default function OCRPage() {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("eng");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setStatus("Please select an image file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setStatus("Image size must be 10 MB or less.");
      return;
    }

    const imageUrl = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setPreview(imageUrl);
    setText("");
    setProgress(0);
    setStatus("Image ready. Click Extract Text.");
  };

  const extractText = async () => {
    if (!file) {
      setStatus("Please select an image first.");
      return;
    }

    setLoading(true);
    setText("");
    setProgress(0);
    setStatus("Starting OCR...");

    let worker = null;

    try {
      worker = await createWorker(language, 1, {
        logger: (message) => {
          if (message.status) {
            setStatus(
              message.status === "recognizing text"
                ? "Reading text from image..."
                : message.status
            );
          }

          if (
            typeof message.progress === "number"
          ) {
            setProgress(
              Math.round(message.progress * 100)
            );
          }
        },
      });

      const result = await worker.recognize(file);

      const extractedText =
        result?.data?.text?.trim() || "";

      setText(extractedText);

      if (extractedText) {
        setProgress(100);
        setStatus("Text extracted successfully! ✅");
      } else {
        setStatus(
          "No readable text was found in this image."
        );
      }
    } catch (error) {
      console.error(error);
      setStatus(
        "OCR failed. Please try a clearer image."
      );
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch (error) {
          console.error(error);
        }
      }

      setLoading(false);
    }
  };

  const copyText = async () => {
    if (!text.trim()) {
      setStatus("There is no text to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setStatus("Text copied to clipboard! ✅");
    } catch (error) {
      console.error(error);
      setStatus(
        "Copy failed. Please select and copy the text manually."
      );
    }
  };

  const downloadText = () => {
    if (!text.trim()) {
      setStatus("There is no text to download.");
      return;
    }

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "KaamKit-OCR-Text.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    setStatus("Text file downloaded! ✅");
  };

  const reset = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview("");
    setText("");
    setProgress(0);
    setStatus("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f8ff",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#14213d",
      }}
    >
      <header
        style={{
          background: "#ffffff",
          borderBottom:
            "1px solid #e5edf7",
          padding: "15px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "950px",
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
                color: "#ffffff",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
              }}
            >
              K
            </span>

            Kaam
            <span style={{ color: "#1677ff" }}>
              Kit
            </span>
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
          maxWidth: "950px",
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
              width: "78px",
              height: "78px",
              margin: "0 auto 15px",
              borderRadius: "20px",
              background: "#e7f1ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            🔎
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "38px",
            }}
          >
            Image OCR
          </h1>

          <p
            style={{
              margin: 0,
              color: "#718096",
              fontSize: "17px",
            }}
          >
            Extract editable text from images
            instantly.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "28px",
            border:
              "1px solid #e4ecf7",
            boxShadow:
              "0 15px 45px rgba(30,80,140,.10)",
          }}
        >
          <label
            htmlFor="ocr-file"
            style={{
              minHeight: "170px",
              border:
                "2px dashed #9dbce5",
              borderRadius: "18px",
              background: "#f7fbff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              cursor: "pointer",
              padding: "25px",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "50%",
                background: "#1677ff",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "27px",
                marginBottom: "12px",
              }}
            >
              ↑
            </div>

            <strong
              style={{ fontSize: "18px" }}
            >
              Select Image
            </strong>

            <span
              style={{
                color: "#718096",
                fontSize: "14px",
                marginTop: "6px",
              }}
            >
              JPG, JPEG, PNG, WEBP — max 10 MB
            </span>

            <input
              ref={inputRef}
              id="ocr-file"
              type="file"
              accept="image/*"
              onChange={handleFile}
              hidden
            />
          </label>

          {file && (
            <div
              style={{
                marginTop: "22px",
                padding: "16px",
                borderRadius: "14px",
                background: "#f5f9ff",
                border:
                  "1px solid #dce9f8",
              }}
            >
              <strong
                style={{
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Selected Image
              </strong>

              <div
                style={{
                  color: "#64748b",
                  wordBreak: "break-word",
                }}
              >
                {file.name}
              </div>
            </div>
          )}

          {preview && (
            <div
              style={{
                marginTop: "22px",
                textAlign: "center",
              }}
            >
              <img
                src={preview}
                alt="OCR preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  borderRadius: "14px",
                  border:
                    "1px solid #dce5f0",
                  objectFit: "contain",
                }}
              />
            </div>
          )}

          <div
            style={{
              marginTop: "22px",
            }}
          >
            <label
              htmlFor="ocr-language"
              style={{
                display: "block",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              OCR Language
            </label>

            <select
              id="ocr-language"
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              disabled={loading}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "15px",
                borderRadius: "12px",
                border:
                  "1px solid #cbd5e1",
                background: "#ffffff",
                fontSize: "16px",
              }}
            >
              <option value="eng">
                English
              </option>

              <option value="hin">
                Hindi
              </option>
            </select>
          </div>

          {loading && (
            <div
              style={{
                marginTop: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginBottom: "7px",
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                <span>
                  Processing OCR...
                </span>

                <strong>
                  {progress}%
                </strong>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "10px",
                  borderRadius: "20px",
                  background: "#e2e8f0",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: "#1677ff",
                    transition:
                      "width .2s ease",
                  }}
                />
              </div>
            </div>
          )}

          {status && (
            <div
              style={{
                marginTop: "18px",
                padding: "14px",
                borderRadius: "12px",
                background: "#eef6ff",
                color: "#1459a6",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {status}
            </div>
          )}

          <button
            type="button"
            onClick={extractText}
            disabled={!file || loading}
            style={{
              width: "100%",
              marginTop: "22px",
              padding: "16px",
              border: "none",
              borderRadius: "12px",
              background:
                !file || loading
                  ? "#94a3b8"
                  : "#1677ff",
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: "800",
              cursor:
                !file || loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading
              ? "Extracting Text..."
              : "Extract Text"}
          </button>

          {text && (
            <div
              style={{
                marginTop: "25px",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                Extracted Text
              </label>

              <textarea
                value={text}
                onChange={(e) =>
                  setText(e.target.value)
                }
                rows={12}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "15px",
                  borderRadius: "12px",
                  border:
                    "1px solid #cbd5e1",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "12px",
                  marginTop: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={copyText}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border:
                      "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#334155",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  📋 Copy Text
                </button>

                <button
                  type="button"
                  onClick={downloadText}
                  style={{
                    padding: "14px",
                    border: "none",
                    borderRadius: "12px",
                    background:
                      "#1677ff",
                    color: "#ffffff",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  ↓ Download TXT
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={reset}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "14px",
              borderRadius: "12px",
              border:
                "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            Reset
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: "10px",
              marginTop: "22px",
            }}
          >
            <div
              style={{
                background: "#f5f9ff",
                borderRadius: "10px",
                padding: "12px 5px",
                textAlign: "center",
                fontSize: "12px",
                color: "#52647a",
              }}
            >
              ✓ Image OCR
            </div>

            <div
              style={{
                background: "#f5f9ff",
                borderRadius: "10px",
                padding: "12px 5px",
                textAlign: "center",
                fontSize: "12px",
                color: "#52647a",
              }}
            >
              ✓ Browser Based
            </div>

            <div
              style={{
                background: "#f5f9ff",
                borderRadius: "10px",
                padding: "12px 5px",
                textAlign: "center",
                fontSize: "12px",
                color: "#52647a",
              }}
            >
              ✓ No Upload
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
