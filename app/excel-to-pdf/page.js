"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

export default function ExcelToPDF() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFile = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setMessage("");
    setFile(null);
    setRows([]);

    try {
      const buffer = await selectedFile.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
        cellDates: true,
      });

      const firstSheet = workbook.SheetNames[0];

      if (!firstSheet) {
        setMessage("Excel file me koi sheet nahi mili.");
        return;
      }

      const worksheet = workbook.Sheets[firstSheet];

      const data = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        raw: false,
      });

      const cleanData = data.filter((row) =>
        row.some((cell) => String(cell).trim() !== "")
      );

      if (!cleanData.length) {
        setMessage("Selected Excel sheet empty hai.");
        return;
      }

      setFile(selectedFile);
      setRows(cleanData);
      setMessage("Excel file successfully loaded.");
    } catch (error) {
      console.error(error);
      setMessage("Excel file read nahi ho pa rahi.");
    }
  };

  const convertToPDF = () => {
    if (!rows.length) {
      setMessage("Pehle Excel file select karo.");
      return;
    }

    setLoading(true);

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const usableWidth = pageWidth - margin * 2;

      const columnCount = Math.max(
        ...rows.map((row) => row.length)
      );

      const normalizedRows = rows.map((row) => {
        const newRow = [];

        for (let i = 0; i < columnCount; i++) {
          newRow.push(
            row[i] === undefined || row[i] === null
              ? ""
              : String(row[i])
          );
        }

        return newRow;
      });

      const header = normalizedRows[0];
      const body = normalizedRows.slice(1);

      // Calculate column widths
      const rawWidths = [];

      for (let col = 0; col < columnCount; col++) {
        let maxLength = String(header[col]).length;

        for (const row of body) {
          maxLength = Math.max(
            maxLength,
            String(row[col] || "").length
          );
        }

        rawWidths.push(
          Math.max(20, Math.min(maxLength * 2, 55))
        );
      }

      const rawTotal = rawWidths.reduce(
        (a, b) => a + b,
        0
      );

      const widths = rawWidths.map(
        (width) => (width / rawTotal) * usableWidth
      );

      let y = 25;

      const drawHeader = () => {
        let x = margin;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7);
        pdf.setTextColor(255, 255, 255);

        const lines = header.map((cell, i) =>
          pdf.splitTextToSize(
            String(cell || ""),
            widths[i] - 4
          )
        );

        const height =
          Math.max(...lines.map((x) => x.length), 1) *
            4 +
          5;

        for (let i = 0; i < columnCount; i++) {
          pdf.setFillColor(22, 119, 255);
          pdf.setDrawColor(190, 200, 215);

          pdf.rect(
            x,
            y,
            widths[i],
            height,
            "FD"
          );

          pdf.text(
            lines[i],
            x + 2,
            y + 4
          );

          x += widths[i];
        }

        y += height;
      };

      const drawRow = (row, index) => {
        const lines = row.map((cell, i) =>
          pdf.splitTextToSize(
            String(cell || ""),
            widths[i] - 4
          )
        );

        const height =
          Math.max(...lines.map((x) => x.length), 1) *
            4 +
          5;

        if (y + height > pageHeight - 12) {
          pdf.addPage();
          y = 12;
          drawHeader();
        }

        let x = margin;

        for (let i = 0; i < columnCount; i++) {
          if (index % 2 === 0) {
            pdf.setFillColor(247, 250, 255);
            pdf.rect(
              x,
              y,
              widths[i],
              height,
              "F"
            );
          }

          pdf.setDrawColor(210, 220, 230);

          pdf.rect(
            x,
            y,
            widths[i],
            height
          );

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(7);
          pdf.setTextColor(30, 41, 59);

          pdf.text(
            lines[i],
            x + 2,
            y + 4
          );

          x += widths[i];
        }

        y += height;
      };

      // Title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(15);
      pdf.setTextColor(20, 33, 61);

      pdf.text(
        "KaamKit - Excel to PDF",
        margin,
        10
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);

      pdf.text(
        file?.name || "Excel File",
        margin,
        17
      );

      drawHeader();

      body.forEach((row, index) => {
        drawRow(row, index);
      });

      // Footer
      const pages = pdf.getNumberOfPages();

      for (let page = 1; page <= pages; page++) {
        pdf.setPage(page);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.setTextColor(120, 130, 145);

        pdf.text(
          `KaamKit | Excel to PDF | Page ${page} of ${pages}`,
          margin,
          pageHeight - 5
        );
      }

      const outputName =
        file?.name?.replace(/\.(xlsx|xls|csv)$/i, "") ||
        "excel";

      pdf.save(`${outputName}.pdf`);

      setMessage("PDF successfully download ho gaya! ✅");
    } catch (error) {
      console.error(error);
      setMessage("PDF create karte time error aa gaya.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setRows([]);
    setMessage("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f8ff",
        fontFamily: "Arial, sans-serif",
        color: "#14213d",
        paddingBottom: "50px",
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
              color: "#1677ff",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            ← Home
          </a>
        </div>
      </header>

      <section
        style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "45px 20px",
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
              fontSize: "50px",
              marginBottom: "10px",
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
            Excel to PDF
          </h1>

          <p
            style={{
              color: "#718096",
              fontSize: "17px",
              margin: 0,
            }}
          >
            Convert Excel files to PDF instantly.
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
            style={{
              display: "block",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            Select Excel File
          </label>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFile}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              marginBottom: "20px",
              background: "#fff",
            }}
          />

          {file && (
            <div
              style={{
                background: "#eef6ff",
                padding: "14px",
                borderRadius: "12px",
                marginBottom: "20px",
                wordBreak: "break-word",
              }}
            >
              <strong>Selected:</strong> {file.name}
            </div>
          )}

          {rows.length > 0 && (
            <div
              style={{
                marginBottom: "20px",
                overflowX: "auto",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  minWidth: "600px",
                  width: "100%",
                  fontSize: "13px",
                }}
              >
                <tbody>
                  {rows.slice(0, 6).map(
                    (row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map(
                          (cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              style={{
                                padding: "9px",
                                border:
                                  "1px solid #e2e8f0",
                                fontWeight:
                                  rowIndex === 0
                                    ? "700"
                                    : "400",
                                background:
                                  rowIndex === 0
                                    ? "#eef5ff"
                                    : "#fff",
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {String(cell || "")}
                            </td>
                          )
                        )}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {message && (
            <div
              style={{
                background: "#eef6ff",
                color: "#1459a6",
                padding: "14px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={convertToPDF}
            disabled={!rows.length || loading}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "none",
              background:
                !rows.length || loading
                  ? "#94a3b8"
                  : "#1677ff",
              color: "#fff",
              fontSize: "17px",
              fontWeight: "800",
              cursor:
                !rows.length || loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading
              ? "Creating PDF..."
              : "Convert Excel to PDF"}
          </button>

          <button
            type="button"
            onClick={reset}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              background: "#fff",
              fontSize: "15px",
              fontWeight: "700",
            }}
          >
            Reset
          </button>
        </div>
      </section>
    </main>
  );
}
