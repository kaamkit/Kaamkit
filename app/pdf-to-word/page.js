"use client";

import { useState } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function PDFToWord() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setMessage("");
    setSuccess(false);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setMessage("Please select a valid PDF file.");
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setFile(null);
      setMessage("PDF size must be less than 25 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const convertToWord = async () => {
    if (!file) {
      setMessage("Please select a PDF file first.");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      // Load PDF.js only in the browser
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

      const arrayBuffer = await file.arrayBuffer();

      const pdfData = new Uint8Array(arrayBuffer);

      const loadingTask = pdfjsLib.getDocument({
        data: pdfData,
        disableWorker: true,
      });

      const pdf = await loadingTask.promise;

      const paragraphs = [];

      // Read every page
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const textContent = await page.getTextContent();

        const items = textContent.items || [];

        let currentLine = "";
        let previousY = null;

        for (const item of items) {
          const text = item.str || "";

          if (!text.trim()) {
            continue;
          }

          const currentY =
            item.transform && item.transform.length >= 6
              ? item.transform[5]
              : null;

          // Detect a new visual line
          if (
            previousY !== null &&
            currentY !== null &&
            Math.abs(currentY - previousY) > 5
          ) {
            if (currentLine.trim()) {
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: currentLine.trim(),
                      size: 22,
                    }),
                  ],
                  spacing: {
                    after: 120,
                  },
                })
              );
            }

            currentLine = text;
          } else {
            if (currentLine && !currentLine.endsWith(" ")) {
              currentLine += " ";
            }

            currentLine += text;
          }

          if (currentY !== null) {
            previousY = currentY;
          }
        }

        // Add remaining line
        if (currentLine.trim()) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: currentLine.trim(),
                  size: 22,
                }),
              ],
              spacing: {
                after: 120,
              },
            })
          );
        }

        // Page separator
        if (pageNumber < pdf.numPages) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "",
                }),
              ],
              pageBreakBefore: true,
            })
          );
        }
      }

      // Check whether text was extracted
      const hasText = paragraphs.some(
        (paragraph) =>
          paragraph.children &&
          paragraph.children.length > 0 &&
          paragraph.children[0].text &&
          paragraph.children[0].text.trim()
      );

      if (!hasText) {
        throw new Error(
          "No selectable text was found. This PDF may be scanned/image-based and needs OCR."
        );
      }

      // Create Word document
      const document = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      // Convert DOCX to Blob
      const blob = await Packer.toBlob(document);

      // Download DOCX
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      const originalName = file.name.replace(/\.pdf$/i, "");

      link.download = `${originalName}.docx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setSuccess(true);
      setMessage("PDF converted successfully. Your Word file has been downloaded.");
    } catch (error) {
      console.error("PDF to Word error:", error);

      setSuccess(false);

      if (
        error?.message?.includes("scanned") ||
        error?.message?.includes("No selectable text")
      ) {
        setMessage(
          "This PDF does not contain selectable text. Scanned PDFs need OCR and cannot be converted accurately with this tool."
        );
      } else {
        setMessage(
          "Conversion failed. Please try another PDF file."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setMessage("");
    setSuccess(false);
    setLoading(false);

    const input = document.getElementById("pdf-file-input");

    if (input) {
      input.value = "";
    }
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
      {/* HEADER */}
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
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <a
            href="/"
            style={{
              textDecoration: "none",
              color: "#14213d",
              fontSize: "24px",
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "#1677ff",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px",
                fontSize: "25px",
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
              fontSize: "15px",
            }}
          >
            ← Home
          </a>
        </div>
      </header>

      {/* MAIN */}
      <section
        style={{
          maxWidth: "850px",
          margin: "0 auto",
          padding: "45px 20px 70px",
        }}
      >
        {/* TITLE */}
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
              margin: "0 auto 16px",
              borderRadius: "20px",
              background: "#e7f1ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
            }}
          >
            📄
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "38px",
              lineHeight: "1.2",
            }}
          >
            PDF to Word Converter
          </h1>

          <p
            style={{
              margin: 0,
              color: "#718096",
              fontSize: "17px",
              lineHeight: "1.6",
            }}
          >
            Convert PDF documents into editable Word files quickly and easily.
          </p>
        </div>

        {/* TOOL CARD */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "30px",
            border: "1px solid #e4ecf7",
            boxShadow: "0 15px 45px rgba(30,80,140,.10)",
          }}
        >
          {/* UPLOAD AREA */}
          <label
            htmlFor="pdf-file-input"
            style={{
              display: "block",
              border: "2px dashed #9fc5ff",
              borderRadius: "18px",
              padding: "35px 20px",
              textAlign: "center",
              background: "#f8fbff",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: "45px",
                marginBottom: "12px",
              }}
            >
              📄
            </div>

            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
                marginBottom: "8px",
              }}
            >
              Select PDF File
            </div>

            <div
              style={{
                color: "#718096",
                fontSize: "14px",
              }}
            >
              Maximum file size: 25 MB
            </div>

            <input
              id="pdf-file-input"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              style={{
                display: "none",
              }}
            />
          </label>

          {/* SELECTED FILE */}
          {file && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                borderRadius: "14px",
                background: "#f0f7ff",
                border: "1px solid #d7e9ff",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  marginBottom: "5px",
                  wordBreak: "break-word",
                }}
              >
                📄 {file.name}
              </div>

              <div
                style={{
                  color: "#718096",
                  fontSize: "14px",
                }}
              >
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          )}

          {/* CONVERT BUTTON */}
          <button
            type="button"
            onClick={convertToWord}
            disabled={loading || !file}
            style={{
              width: "100%",
              marginTop: "22px",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              background:
                loading || !file ? "#9bbbe8" : "#1677ff",
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: "800",
              cursor:
                loading || !file ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Converting PDF..." : "Convert to Word"}
          </button>

          {/* MESSAGE */}
          {message && (
            <div
              style={{
                marginTop: "18px",
                padding: "15px",
                borderRadius: "12px",
                background: success ? "#ecfdf3" : "#fff4f4",
                border: success
                  ? "1px solid #b7ebc6"
                  : "1px solid #ffcaca",
                color: success ? "#18794e" : "#b42318",
                lineHeight: "1.5",
                fontSize: "14px",
              }}
            >
              {success ? "✅ " : "⚠️ "}
              {message}
            </div>
          )}

          {/* RESET */}
          <button
            type="button"
            onClick={resetTool}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#14213d",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Reset
          </button>

          {/* INFO */}
          <div
            style={{
              marginTop: "25px",
              padding: "18px",
              borderRadius: "15px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#64748b",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            <strong style={{ color: "#334155" }}>
              Important:
            </strong>{" "}
            This tool extracts selectable text from PDF files and creates an
            editable Word document. Scanned/image-only PDFs require OCR and
            are not supported by this version.
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: "25px 20px",
          color: "#718096",
          fontSize: "14px",
        }}
      >
        © {new Date().getFullYear()} KaamKit. Free online tools.
      </footer>
    </main>
  );
}
