"use client";

import { useState } from "react";

export default function PdfToExcel() {
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

      // Load PDF.js only in browser
      const pdfjsLib = await import(
        "pdfjs-dist/legacy/build/pdf.mjs"
      );

      // PDF.js worker
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@6.2.108/legacy/build/pdf.worker.min.mjs";

      // Load Excel library
      const XLSX = await import("xlsx");

      setMessage("Reading PDF...");

      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      }).promise;

      const workbook = XLSX.utils.book_new();

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

        const items = textContent.items
          .filter((item) => item.str && item.str.trim())
          .map((item) => ({
            text: item.str.trim(),
            x: item.transform?.[4] || 0,
            y: item.transform?.[5] || 0,
          }));

        if (items.length === 0) {
          const emptySheet = XLSX.utils.aoa_to_sheet([
            ["No readable text found on this page"],
          ]);

          XLSX.utils.book_append_sheet(
            workbook,
            emptySheet,
            `Page ${pageNumber}`
          );

          continue;
        }

        // Sort items from top to bottom
        items.sort((a, b) => {
          if (Math.abs(a.y - b.y) > 5) {
            return b.y - a.y;
          }

          return a.x - b.x;
        });

        // Group text items into rows
        const rows = [];

        for (const item of items) {
          let row = rows.find(
            (existingRow) =>
              Math.abs(existingRow.y - item.y) <= 5
          );

          if (!row) {
            row = {
              y: item.y,
              items: [],
            };

            rows.push(row);
          }

          row.items.push(item);
        }

        // Sort rows top to bottom
        rows.sort((a, b) => b.y - a.y);

        // Convert rows into columns
        const data = rows.map((row) => {
          row.items.sort((a, b) => a.x - b.x);

          return row.items.map((item) => item.text);
        });

        // Find maximum number of columns
        const maxColumns = Math.max(
          ...data.map((row) => row.length)
        );

        // Make every row same column length
        const normalizedData = data.map((row) => {
          const newRow = [...row];

          while (newRow.length < maxColumns) {
            newRow.push("");
          }

          return newRow;
        });

        const worksheet =
          XLSX.utils.aoa_to_sheet(normalizedData);

        // Auto column widths
        const columnWidths = [];

        for (let column = 0; column < maxColumns; column++) {
          let maxLength = 10;

          for (const row of normalizedData) {
            const value = row[column] || "";

            if (String(value).length > maxLength) {
              maxLength = String(value).length;
            }
          }

          columnWidths.push({
            wch: Math.min(maxLength + 2, 40),
          });
        }

        worksheet["!cols"] = columnWidths;

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          `Page ${pageNumber}`
        );
      }

      setMessage("Creating Excel file...");

      const excelData = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelData], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download =
        file.name.replace(/\.pdf$/i, "") + ".xlsx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);

      setMessage(
        "✅ PDF successfully converted to Excel!"
      );
    } catch (error) {
      console.error("PDF to Excel Error:", error);

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
          PDF to Excel
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "18px",
            marginBottom: "30px",
          }}
        >
          Convert your PDF files into Excel spreadsheets.
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
            : "Convert to Excel"}
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
