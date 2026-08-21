"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFSplit() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFile = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setMessage("");
    setRange("");
    setPageCount(0);

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setFile(null);
      setMessage("Please select a valid PDF file.");
      return;
    }

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);

      setFile(selectedFile);
      setPageCount(pdf.getPageCount());
      setMessage(
        `PDF loaded successfully. ${pdf.getPageCount()} page(s) found.`
      );
    } catch (error) {
      console.error(error);
      setFile(null);
      setMessage("Unable to read this PDF file.");
    }
  };

  const parsePages = (value, totalPages) => {
    const result = new Set();

    const parts = value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    for (const part of parts) {
      if (part.includes("-")) {
        const [startText, endText] = part
          .split("-")
          .map((x) => x.trim());

        const start = Number(startText);
        const end = Number(endText);

        if (
          !Number.isInteger(start) ||
          !Number.isInteger(end) ||
          start < 1 ||
          end < start ||
          end > totalPages
        ) {
          throw new Error("Invalid page range.");
        }

        for (let i = start; i <= end; i++) {
          result.add(i);
        }
      } else {
        const page = Number(part);

        if (
          !Number.isInteger(page) ||
          page < 1 ||
          page > totalPages
        ) {
          throw new Error("Invalid page number.");
        }

        result.add(page);
      }
    }

    return Array.from(result).sort((a, b) => a - b);
  };

  const splitPDF = async () => {
    if (!file) {
      setMessage("Please select a PDF first.");
      return;
    }

    if (!range.trim()) {
      setMessage(
        "Please enter the pages you want to extract."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const pages = parsePages(range, pageCount);

      if (!pages.length) {
        setMessage("No valid pages selected.");
        setLoading(false);
        return;
      }

      const sourceBuffer = await file.arrayBuffer();

      const sourcePdf = await PDFDocument.load(sourceBuffer);
      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(
        sourcePdf,
        pages.map((page) => page - 1)
      );

      copiedPages.forEach((page) => {
        newPdf.addPage(page);
      });

      const pdfBytes = await newPdf.save();

      const blob = new Blob([pdfBytes], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "KaamKit-Split-PDF.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setMessage(
        `Successfully extracted ${pages.length} page(s). PDF downloaded. ✅`
      );
    } catch (error) {
      console.error(error);
      setMessage(
        "Invalid page range. Example: 1-3 or 1,3,5."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setRange("");
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
            ✂️
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "38px",
            }}
          >
            PDF Split
          </h1>

          <p
            style={{
              margin: 0,
              color: "#718096",
              fontSize: "17px",
            }}
          >
            Extract selected pages from a PDF into a new PDF.
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
                fontSize: "28px",
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
                padding: "15px",
                borderRadius: "12px",
                background: "#f5f9ff",
                border: "1px solid #dce9f8",
              }}
            >
              <strong>Selected PDF</strong>

              <div
                style={{
                  marginTop: "5px",
                  color: "#64748b",
                  wordBreak: "break-word",
                }}
              >
                {file.name}
              </div>

              <div
                style={{
                  marginTop: "5px",
                  color: "#1677ff",
                  fontWeight: "700",
                }}
              >
                Total Pages: {pageCount}
              </div>
            </div>
          )}

          <div style={{ marginTop: "22px" }}>
            <label
              htmlFor="page-range"
              style={{
                display: "block",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              Pages to Extract
            </label>

            <input
              id="page-range"
              type="text"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder="Example: 1-3 or 1,3,5"
              disabled={!file}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "16px",
                outline: "none",
              }}
            />

            <p
              style={{
                color: "#718096",
                fontSize: "13px",
                marginTop: "8px",
              }}
            >
              Use ranges like <strong>1-5</strong> or individual
              pages like <strong>1,3,7</strong>.
            </p>
          </div>

          {message && (
            <div
              style={{
                marginTop: "18px",
                padding: "14px",
                borderRadius: "12px",
                background: "#eef6ff",
                color: "#1459a6",
                fontSize: "14px",
              }}
            >
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={splitPDF}
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
              ? "Splitting PDF..."
              : "Split PDF"}
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
        </div>
      </section>
    </main>
  );
}
