"use client";

import { useState } from "react";

export default function WordToExcel() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleConvert = async () => {
    if (!file) {
      setMessage("Please select a Word file first.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".docx")) {
      setMessage("Please select a .docx Word file.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Loading Word converter...");

      // Load libraries only in the browser
      const mammothModule = await import("mammoth");
      const XLSX = await import("xlsx");

      const mammoth = mammothModule.default || mammothModule;

      setMessage("Reading Word document...");

      const arrayBuffer = await file.arrayBuffer();

      // Convert DOCX to HTML
      const result = await mammoth.convertToHtml({
        arrayBuffer,
      });

      const html = result.value;

      if (!html || !html.trim()) {
        throw new Error(
          "No readable content was found in this Word document."
        );
      }

      setMessage("Preparing Excel spreadsheet...");

      // Parse Mammoth-generated HTML
      const parser = new DOMParser();
      const documentHtml = parser.parseFromString(
        html,
        "text/html"
      );

      const workbook = XLSX.utils.book_new();

      const tables = documentHtml.querySelectorAll("table");

      // If the Word document contains tables
      if (tables.length > 0) {
        tables.forEach((table, tableIndex) => {
          const rows = [];
          const tableRows = table.querySelectorAll("tr");

          tableRows.forEach((tr) => {
            const cells = tr.querySelectorAll("th, td");

            const row = [];

            cells.forEach((cell) => {
              row.push(
                cell.textContent
                  .replace(/\s+/g, " ")
                  .trim()
              );
            });

            if (row.length > 0) {
              rows.push(row);
            }
          });

          if (rows.length > 0) {
            const worksheet =
              XLSX.utils.aoa_to_sheet(rows);

            // Auto column width
            const maxColumns = Math.max(
              ...rows.map((row) => row.length)
            );

            worksheet["!cols"] = Array.from(
              { length: maxColumns },
              (_, columnIndex) => {
                let maxLength = 10;

                rows.forEach((row) => {
                  const value = row[columnIndex] || "";

                  maxLength = Math.max(
                    maxLength,
                    String(value).length
                  );
                });

                return {
                  wch: Math.min(maxLength + 2, 40),
                };
              }
            );

            XLSX.utils.book_append_sheet(
              workbook,
              worksheet,
              `Table ${tableIndex + 1}`
            );
          }
        });
      }

      // Get normal paragraphs/headings outside tables
      const bodyElements =
        documentHtml.body.querySelectorAll(
          "h1, h2, h3, h4, h5, h6, p, li"
        );

      const textRows = [];

      bodyElements.forEach((element) => {
        // Ignore text that is already inside a table
        if (element.closest("table")) {
          return;
        }

        const text = element.textContent
          .replace(/\s+/g, " ")
          .trim();

        if (text) {
          textRows.push([text]);
        }
      });

      // Add text sheet if there is normal text
      if (textRows.length > 0) {
        const textSheet =
          XLSX.utils.aoa_to_sheet(textRows);

        textSheet["!cols"] = [
          {
            wch: 80,
          },
        ];

        XLSX.utils.book_append_sheet(
          workbook,
          textSheet,
          "Document Text"
        );
      }

      if (workbook.SheetNames.length === 0) {
        throw new Error(
          "No readable tables or text were found."
        );
      }

      setMessage("Creating Excel file...");

      // Generate XLSX file
      const excelData = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelData], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Download file
      const downloadUrl =
        URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = downloadUrl;

      link.download =
        file.name.replace(/\.docx$/i, "") +
        ".xlsx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);

      if (result.messages?.length > 0) {
        console.log(
          "Mammoth conversion messages:",
          result.messages
        );
      }

      setMessage(
        "✅ Word successfully converted to Excel!"
      );
    } catch (error) {
      console.error(
        "Word to Excel Error:",
        error
      );

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
          boxShadow:
            "0 8px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            marginBottom: "10px",
          }}
        >
          Word to Excel
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "18px",
            marginBottom: "30px",
          }}
        >
          Convert your Word documents into
          Excel spreadsheets.
        </p>

        <input
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => {
            setFile(
              e.target.files?.[0] || null
            );
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
            Selected:{" "}
            <strong>{file.name}</strong>
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
            background: loading
              ? "#999"
              : "#111827",
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
