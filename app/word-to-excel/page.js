"use client";

import { useState } from "react";
import * as mammoth from "mammoth/mammoth.browser";
import * as XLSX from "xlsx";

export default function WordToExcel() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setFile(null);
    setMessage("");
    setSuccess(false);

    if (!selectedFile) return;

    const isDocx =
      selectedFile.name.toLowerCase().endsWith(".docx");

    if (!isDocx) {
      setMessage("Please select a Word .docx file.");
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setMessage("Word file size must be less than 25 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const convertToExcel = async () => {
    if (!file) {
      setMessage("Please select a Word file first.");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const result = await mammoth.convertToHtml({
        arrayBuffer,
      });

      const html = result.value;

      const parser = new DOMParser();
      const doc = parser.parseFromString(
        html,
        "text/html"
      );

      const workbook = XLSX.utils.book_new();

      const tables = Array.from(
        doc.querySelectorAll("table")
      );

      // If the Word document contains tables,
      // each table becomes a separate Excel sheet.
      if (tables.length > 0) {
        tables.forEach((table, tableIndex) => {
          const rows = Array.from(
            table.querySelectorAll("tr")
          );

          const data = rows.map((row) => {
            const cells = Array.from(
              row.querySelectorAll("th, td")
            );

            return cells.map((cell) =>
              cell.textContent
                .replace(/\s+/g, " ")
                .trim()
            );
          });

          if (data.length > 0) {
            const worksheet =
              XLSX.utils.aoa_to_sheet(data);

            worksheet["!cols"] = Array.from(
              {
                length: Math.max(
                  ...data.map((row) => row.length),
                  1
                ),
              },
              () => ({
                wch: 22,
              })
            );

            XLSX.utils.book_append_sheet(
              workbook,
              worksheet,
              `Table ${tableIndex + 1}`
            );
          }
        });
      }

      // If there are no tables, export normal Word
      // paragraphs into one Excel sheet.
      if (tables.length === 0) {
        const paragraphs = Array.from(
          doc.querySelectorAll("p")
        )
          .map((paragraph) =>
            paragraph.textContent
              .replace(/\s+/g, " ")
              .trim()
          )
          .filter(Boolean);

        if (paragraphs.length === 0) {
          throw new Error(
            "No readable content was found."
          );
        }

        const data = [
          ["Word Document Content"],
          ...paragraphs.map((text) => [text]),
        ];

        const worksheet =
          XLSX.utils.aoa_to_sheet(data);

        worksheet["!cols"] = [
          {
            wch: 80,
          },
        ];

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          "Content"
        );
      }

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      const originalName = file.name.replace(
        /\.docx$/i,
        ""
      );

      link.download = `${originalName}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setSuccess(true);
      setMessage(
        "Word file converted successfully. Your Excel file has been downloaded."
      );
    } catch (error) {
      console.error("Word to Excel error:", error);

      setSuccess(false);
      setMessage(
        "Conversion failed. Please try another .docx file."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setMessage("");
    setSuccess(false);
    setLoading(false);

    const input =
      document.getElementById("word-excel-input");

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
              margin: "0 auto 16px",
              borderRadius: "20px",
              background: "#e7f1ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
            }}
          >
            📊
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "38px",
            }}
          >
            Word to Excel Converter
          </h1>

          <p
            style={{
              margin: 0,
              color: "#718096",
              fontSize: "17px",
            }}
          >
            Convert Word tables and document content
            into an Excel file.
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "30px",
            border: "1px solid #e4ecf7",
            boxShadow:
              "0 15px 45px rgba(30,80,140,.10)",
          }}
        >
          <label
            htmlFor="word-excel-input"
            style={{
              display: "block",
              border: "2px dashed #9fc5ff",
              borderRadius: "18px",
              padding: "40px 20px",
              textAlign: "center",
              background: "#f8fbff",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "12px",
              }}
            >
              📝
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "21px",
              }}
            >
              Select Word File
            </h2>

            <p
              style={{
                margin: 0,
                color: "#718096",
              }}
            >
              DOCX files only • Maximum 25 MB
            </p>

            <input
              id="word-excel-input"
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>

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
              <strong
                style={{
                  display: "block",
                  wordBreak: "break-word",
                }}
              >
                📝 {file.name}
              </strong>

              <span
                style={{
                  display: "block",
                  marginTop: "5px",
                  color: "#718096",
                  fontSize: "14px",
                }}
              >
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={convertToExcel}
            disabled={loading || !file}
            style={{
              width: "100%",
              marginTop: "22px",
              padding: "16px",
              border: "none",
              borderRadius: "12px",
              background:
                loading || !file
                  ? "#9bbbe8"
                  : "#1677ff",
              color: "#fff",
              fontSize: "17px",
              fontWeight: "800",
              cursor:
                loading || !file
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading
              ? "Converting..."
              : "Convert to Excel →"}
          </button>

          {message && (
            <div
              style={{
                marginTop: "18px",
                padding: "15px",
                borderRadius: "12px",
                background: success
                  ? "#ecfdf3"
                  : "#fff4f4",
                border: success
                  ? "1px solid #b7ebc6"
                  : "1px solid #ffcaca",
                color: success
                  ? "#18794e"
                  : "#b42318",
                lineHeight: "1.5",
                fontSize: "14px",
              }}
            >
              {success ? "✅ " : "⚠️ "}
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={resetTool}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              background: "#fff",
              color: "#14213d",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Reset
          </button>

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
              Note:
            </strong>{" "}
            Word tables are exported as separate Excel
            sheets. If the document has no tables, its
            readable paragraphs are placed into an Excel
            sheet.
          </div>
        </div>
      </section>

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
