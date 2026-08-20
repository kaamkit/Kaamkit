"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

export default function ExcelToPDF() {
  const [file, setFile] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [sheetName, setSheetName] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setMessage("");
    setFile(null);
    setWorkbook(null);
    setSheetName("");
    setRows([]);

    const name = selectedFile.name.toLowerCase();

    if (
      !name.endsWith(".xlsx") &&
      !name.endsWith(".xls") &&
      !name.endsWith(".csv")
    ) {
      setMessage("Please select an Excel (.xlsx, .xls) or CSV file.");
      return;
    }

    try {
      const buffer = await selectedFile.arrayBuffer();

      const wb = XLSX.read(buffer, {
        type: "array",
        cellDates: true,
      });

      if (!wb.SheetNames.length) {
        setMessage("No worksheet found in this file.");
        return;
      }

      const firstSheet = wb.SheetNames[0];
      const worksheet = wb.Sheets[firstSheet];

      const data = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        raw: false,
      });

      setFile(selectedFile);
      setWorkbook(wb);
      setSheetName(firstSheet);
      setRows(data);

      setMessage("File loaded successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to read this Excel file.");
    }
  };

  const changeSheet = (event) => {
    const selectedSheet = event.target.value;

    if (!workbook) return;

    try {
      const worksheet = workbook.Sheets[selectedSheet];

      const data = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        raw: false,
      });

      setSheetName(selectedSheet);
      setRows(data);
      setMessage(`Sheet "${selectedSheet}" selected.`);
    } catch (error) {
      console.error(error);
      setMessage("Unable to read this sheet.");
    }
  };

  const formatCell = (value) => {
    if (value === null || value === undefined) return "";

    return String(value)
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .trim();
  };

  const convertToPDF = () => {
    if (!rows.length) {
      setMessage("Please select an Excel file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const cleanRows = rows
        .map((row) =>
          Array.isArray(row) ? row.map((cell) => formatCell(cell)) : []
        )
        .filter((row) => row.some((cell) => cell !== ""));

      if (!cleanRows.length) {
        setMessage("The selected sheet is empty.");
        setLoading(false);
        return;
      }

      const columnCount = Math.max(
        ...cleanRows.map((row) => row.length)
      );

      const normalizedRows = cleanRows.map((row) => {
        const newRow = [];

        for (let i = 0; i < columnCount; i++) {
          newRow.push(row[i] || "");
        }

        return newRow;
      });

      const header = normalizedRows[0];
      const body = normalizedRows.slice(1);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const bottomMargin = 12;

      let y = margin;

      // Title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(15);
      pdf.setTextColor(20, 33, 61);
      pdf.text("KaamKit - Excel to PDF", margin, y);

      y += 7;

      // File information
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);

      pdf.text(
        `File: ${file?.name || "Excel File"} | Sheet: ${sheetName}`,
        margin,
        y
      );

      y += 7;

      // Calculate column widths
      const widths = [];

      for (let column = 0; column < columnCount; column++) {
        let longest = String(header[column] || "").length;

        for (const row of body) {
          const length = String(row[column] || "").length;

          if (length > longest) {
            longest = length;
          }
        }

        widths.push(Math.max(18, Math.min(longest * 2, 55)));
      }

      const totalWidth = widths.reduce(
        (sum, width) => sum + width,
        0
      );

      const columnWidths = widths.map(
        (width) => (width / totalWidth) * usableWidth
      );

      const fontSize = 7;
      const lineHeight = 3.8;
      const padding = 1.8;

      const drawHeader = () => {
        let x = margin;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(fontSize);
        pdf.setTextColor(255, 255, 255);

        const headerLines = header.map((cell, index) =>
          pdf.splitTextToSize(
            String(cell || ""),
            Math.max(columnWidths[index] - padding * 2, 5)
          )
        );

        const headerHeight =
          Math.max(
            ...headerLines.map((lines) => lines.length),
            1
          ) *
            lineHeight +
          padding * 2;

        for (let i = 0; i < columnCount; i++) {
          pdf.setFillColor(22, 119, 255);
          pdf.setDrawColor(180, 195, 215);

          pdf.rect(
            x,
            y,
            columnWidths[i],
            headerHeight,
            "FD"
          );

          pdf.setTextColor(255, 255, 255);

          pdf.text(
            headerLines[i],
            x + padding,
            y + padding + lineHeight - 1
          );

          x += columnWidths[i];
        }

        y += headerHeight;
      };

      const drawBodyRow = (row, rowNumber) => {
        const cellLines = row.map((cell, index) =>
          pdf.splitTextToSize(
            String(cell || ""),
            Math.max(columnWidths[index] - padding * 2, 5)
          )
        );

        const rowHeight =
          Math.max(
            ...cellLines.map((lines) => lines.length),
            1
          ) *
            lineHeight +
          padding * 2;

        if (y + rowHeight > pageHeight - bottomMargin) {
          pdf.addPage();
          y = margin;
          drawHeader();
        }

        let x = margin;

        for (let i = 0; i < columnCount; i++) {
          if (rowNumber % 2 === 0) {
            pdf.setFillColor(247, 250, 255);
            pdf.rect(
              x,
              y,
              columnWidths[i],
              rowHeight,
              "F"
            );
          }

          pdf.setDrawColor(210, 220, 232);
          pdf.rect(
            x,
            y,
            columnWidths[i],
            rowHeight
          );

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(fontSize);
          pdf.setTextColor(30, 41, 59);

          pdf.text(
            cellLines[i],
            x + padding,
            y + padding + lineHeight - 1
          );

          x += columnWidths[i];
        }

        y += rowHeight;
      };

      drawHeader();

      body.forEach((row, index) => {
        drawBodyRow(row, index + 1);
      });

      // Footer on every page
      const totalPages = pdf.getNumberOfPages();

      for (let page = 1; page <= totalPages; page++) {
        pdf.setPage(page);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.setTextColor(120, 130, 145);

        pdf.text(
          `KaamKit • Excel to PDF • Page ${page} of ${totalPages}`,
          margin,
          pageHeight - 6
        );
      }

      const outputName =
        file?.name?.replace(/\.(xlsx|xls|csv)$/i, "") ||
        "excel";

      pdf.save(`${outputName}.pdf`);

      setMessage("PDF created successfully!");
    } catch (error) {
      console.error(error);
      setMessage(
        "PDF creation failed. Please try another Excel file."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setWorkbook(null);
    setSheetName("");
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
      }}
    >
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5edf7",
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
            Excel to PDF
          </h1>

          <p
            style={{
              margin: 0,
              color: "#718096",
              fontSize: "17px",
            }}
          >
            Convert Excel files into clean PDF documents.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
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
            onChange={handleFileChange}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              fontSize: "15px",
              marginBottom: "20px",
            }}
          />

          {file && (
            <div
              style={{
                background: "#f5f9ff",
                border: "1px solid #dce9f8",
                borderRadius: "14px",
                padding: "15px",
                marginBottom: "20px",
              }}
            >
              <strong>Selected File</strong>

              <div
                style={{
                  marginTop: "5px",
                  color: "#64748b",
                  wordBreak: "break-word",
                }}
              >
                {file.name}
              </div>
            </div>
          )}

          {workbook && (
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                Select Sheet
              </label>

              <select
                value={sheetName}
                onChange={changeSheet}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  fontSize: "16px",
                  background: "#ffffff",
                }}
              >
                {workbook.SheetNames.map((sheet) => (
                  <option key={sheet} value={sheet}>
                    {sheet}
                  </option>
                ))}
              </select>
            </div>
          )}

          {rows.length > 0 && (
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "15px",
                marginBottom: "20px",
              }}
            >
              <strong>Excel Preview</strong>

              <div
                style={{
                  overflowX: "auto",
                  marginTop: "12px",
                  maxHeight: "260px",
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
                    {rows.slice(0, 8).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            style={{
                              padding: "9px",
                              border:
                                "1px solid #e2e8f0",
                              background:
                                rowIndex === 0
                                  ? "#eef5ff"
                                  : "#ffffff",
                              fontWeight:
                                rowIndex === 0
                                  ? "700"
                                  : "400",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatCell(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {message && (
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                background: "#eef6ff",
                color: "#1459a6",
                marginBottom: "20px",
                fontSize: "14px",
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
              color: "#ffffff",
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
              background: "#ffffff",
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
