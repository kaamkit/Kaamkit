"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFCompress() {
  const [file, setFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFile = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setMessage("");
    setCompressedSize(0);

    const isPDF =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      setFile(null);
      setOriginalSize(0);
      setMessage("Please select a valid PDF file.");
      return;
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setMessage("PDF selected successfully.");
  };

  const compressPDF = async () => {
    if (!file) {
      setMessage("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setMessage("Compressing PDF...");

    try {
      const buffer = await file.arrayBuffer();

      const pdf = await PDFDocument.load(buffer, {
        ignoreEncryption: false,
      });

      /*
       * pdf-lib rewrites the PDF and removes/rebuilds
       * unnecessary document structure where possible.
       * This is a safe browser-side optimization.
       */
      const compressedBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        compress: true,
      });

      const blob = new Blob([compressedBytes], {
        type: "application/pdf",
      });

      setCompressedSize(blob.size);

      const original = file.size;
      const compressed = blob.size;

      if (compressed >= original) {
        setMessage(
          "PDF was processed successfully, but this file could not be reduced further without changing its contents."
        );
      } else {
        const reduction =
          ((original - compressed) / original) * 100;

        setMessage(
          `Compression complete! Size reduced by ${reduction.toFixed(
            1
          )}%.`
        );
      }

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "KaamKit-Compressed-PDF.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to compress this PDF. The file may be encrypted, corrupted, or unsupported."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setMessage("");
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
          padding: "15px 20px",
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
            🗜️
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "38px",
            }}
          >
            PDF Compressor
          </h1>

          <p
            style={{
              margin: 0,
              color: "#718096",
              fontSize: "17px",
            }}
          >
            Reduce PDF file size quickly in your browser.
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "28px",
            border: "1px solid #e4ecf7",
            boxShadow:
              "0 15px 45px rgba(30,80,140,.10)",
          }}
        >
          <label
            htmlFor="pdf-file"
            style={{
              minHeight: "170px",
              border: "2px dashed #9dbce5",
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
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "27px",
                marginBottom: "12px",
              }}
            >
              ↑
            </div>

            <strong style={{ fontSize: "18px" }}>
              Select PDF File
            </strong>

            <span
              style={{
                color: "#718096",
                fontSize: "14px",
                marginTop: "6px",
              }}
            >
              Choose a PDF from your device
            </span>

            <input
              id="pdf-file"
              type="file"
              accept="application/pdf,.pdf"
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
                border: "1px solid #dce9f8",
              }}
            >
              <strong
                style={{
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Selected PDF
              </strong>

              <div
                style={{
                  color: "#64748b",
                  wordBreak: "break-word",
                  marginBottom: "12px",
                }}
              >
                {file.name}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <span>
                  Original:{" "}
                  <strong>
                    {formatSize(originalSize)}
                  </strong>
                </span>

                {compressedSize > 0 && (
                  <span>
                    New:{" "}
                    <strong>
                      {formatSize(compressedSize)}
                    </strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {message && (
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
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={compressPDF}
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
              color: "#fff",
              fontSize: "17px",
              fontWeight: "800",
              cursor:
                !file || loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading
              ? "Compressing PDF..."
              : "Compress PDF"}
          </button>

          <button
            type="button"
            onClick={reset}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "14px",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              background: "#fff",
              color: "#334155",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Reset
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
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
              ✓ Free
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
