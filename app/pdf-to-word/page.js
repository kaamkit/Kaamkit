"use client";

import { useState } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

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
      setMessage("Converting PDF to Word...");

      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        disableWorker: true,
      }).promise;

      const paragraphs = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();

        let pageText = "";
        let lastY = null;

        for (const item of textContent.items) {
          const text = item.str || "";

          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
            pageText += "\n";
          }

          pageText += text + " ";
          lastY = item.transform[5];
        }

        const lines = pageText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        lines.forEach((line) => {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  size: 22,
                }),
              ],
              spacing: {
                after: 120,
              },
            })
          );
        });

        if (pageNumber < pdf.numPages) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun("")],
            })
          );
        }
      }

      if (paragraphs.length === 0) {
        throw new Error(
          "No selectable text found. This may be a scanned/image PDF."
        );
      }

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = file.name.replace(/\.pdf$/i, "") + ".docx";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setMessage("PDF successfully converted to Word!");
    } catch (error) {
      console.error(error);
      setMessage(
        "Conversion failed. Please try a normal text-based PDF."
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
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#ffffff",
          padding: "35px",
          borderRadius: "18px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          PDF to Word
        </h1>

        <p style={{ color: "#666", marginBottom: "25px" }}>
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
          }}
        />

        {file && (
          <p style={{ marginBottom: "20px", color: "#333" }}>
            Selected: <strong>{file.name}</strong>
          </p>
        )}

        <button
          onClick={handleConvert}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "10px",
            background: loading ? "#999" : "#111827",
            color: "#fff",
            fontSize: "17px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Converting..." : "Convert to Word"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "20px",
              color: message.includes("successfully")
                ? "green"
                : "#555",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
