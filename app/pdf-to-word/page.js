"use client";

import { useState } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleConvert = async () => {
    if (!file) {
      setMessage("Please select a PDF file first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Loading PDF converter...");

      // Load PDF.js only in the browser
      const pdfjsLib = await import(
        "pdfjs-dist/legacy/build/pdf.mjs"
      );

      // PDF.js worker configuration
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@6.2.108/legacy/build/pdf.worker.min.mjs";

      setMessage("Reading PDF...");

      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      }).promise;

      const paragraphs = [];

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {
        setMessage(
          `Reading page ${pageNumber} of ${pdf.numPages}...`
        );

        const page = await pdf.getPage(pageNumber);

        const textContent = await page.getTextContent();

        let currentLine = "";
        let previousY = null;

        for (const item of textContent.items) {
          if (!item.str) continue;

          const currentY = item.transform?.[5] ?? 0;

          // Detect a new line
          if (
            previousY !== null &&
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

            currentLine = "";
          }

          currentLine += item.str + " ";
          previousY = currentY;
        }

        // Add remaining text from page
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

        // Page break
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

      if (paragraphs.length === 0) {
        throw new Error(
          "No readable text was found in this PDF."
        );
      }

      setMessage("Creating Word document...");

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);

      // Download Word file
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download =
        file.name.replace(/\.pdf$/i, "") + ".docx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);

      setMessage(
        "✅ PDF successfully converted to Word!"
      );
    } catch (error) {
      console.error("PDF to Word Error:", error);

      setMessage(
        "Conversion failed: " +
          (error?.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#f5f7fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#ffffff",
          padding: "35px",
          marginTop: "30px",
          borderRadius: "18px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            marginBottom: "10px",
          }}
        >
          PDF to Word
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "18px",
            marginBottom: "30px",
          }}
        >
          Convert your PDF files into editable Word documents.
        </p>

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setMessage("");
          }}
          style={{
            width: "100%",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        {file && (
          <p
            style={{
              marginBottom: "20px",
              color: "#333",
              wordBreak: "break-word",
            }}
          >
            Selected: <strong>{file.name}</strong>
          </p>
        )}

        <button
          onClick={handleConvert}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "10px",
            background: loading ? "#999" : "#111827",
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: "600",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Converting..."
            : "Convert to Word"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "22px",
              color: message.startsWith("✅")
                ? "green"
                : "#555",
              fontSize: "16px",
              lineHeight: "1.5",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
