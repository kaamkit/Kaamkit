"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFMerge() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFiles = (event) => {
    const selected = Array.from(event.target.files || []);

    const pdfFiles = selected.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    if (!pdfFiles.length) {
      setMessage("Please select PDF files only.");
      return;
    }

    setFiles((previous) => [...previous, ...pdfFiles]);
    setMessage(`${pdfFiles.length} PDF file(s) added.`);
    event.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const moveUp = (index) => {
    if (index === 0) return;

    setFiles((previous) => {
      const updated = [...previous];
      [updated[index - 1], updated[index]] = [
        updated[index],
        updated[index - 1],
      ];
      return updated;
    });
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;

    setFiles((previous) => {
      const updated = [...previous];
      [updated[index], updated[index + 1]] = [
        updated[index + 1],
        updated[index],
      ];
      return updated;
    });
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setMessage("Please select at least 2 PDF files.");
      return;
    }

    setLoading(true);
    setMessage("Merging PDFs...");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();

        const sourcePdf = await PDFDocument.load(arrayBuffer);

        const pages = await mergedPdf.copyPages(
          sourcePdf,
          sourcePdf.getPageIndices()
        );

        pages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const mergedBytes = await mergedPdf.save();

      const blob = new Blob([mergedBytes], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "KaamKit-Merged-PDF.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setMessage("PDFs merged successfully! ✅");
    } catch (error) {
      console.error(error);
      setMessage(
        "Unable to merge the PDFs. Please check that the files are valid PDF documents."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFiles([]);
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
            📑
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "38px",
            }}
          >
            PDF Merge
          </h1>

          <p
            style={{
              margin: 0,
              color: "#718096",
              fontSize: "17px",
            }}
          >
            Merge multiple PDF files into one PDF document.
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
            htmlFor="pdf-files"
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
              +
            </div>

            <strong style={{ fontSize: "18px" }}>
              Select PDF Files
            </strong>

            <span
              style={{
                color: "#718096",
                fontSize: "14px",
                marginTop: "6px",
              }}
            >
              Select two or more PDF files
            </span>

            <input
              id="pdf-files"
              type="file"
              accept="application/pdf,.pdf"
              multiple
              onChange={handleFiles}
              hidden
            />
          </label>

          {files.length > 0 && (
            <div style={{ marginTop: "25px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  margin: "0 0 15px",
                }}
              >
                Selected PDFs ({files.length})
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "13px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                    }}
                  >
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "#e8f2ff",
                        color: "#1677ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "800",
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </span>

                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "14px",
                      }}
                    >
                      {file.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      style={{
                        border: "1px solid #cbd5e1",
                        background: "#fff",
                        borderRadius: "7px",
                        padding: "6px 8px",
                        cursor:
                          index === 0
                            ? "not-allowed"
                            : "pointer",
                        opacity: index === 0 ? 0.4 : 1,
                      }}
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === files.length - 1}
                      style={{
                        border: "1px solid #cbd5e1",
                        background: "#fff",
                        borderRadius: "7px",
                        padding: "6px 8px",
                        cursor:
                          index === files.length - 1
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          index === files.length - 1
                            ? 0.4
                            : 1,
                      }}
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      style={{
                        border: "none",
                        background: "#fff0f0",
                        color: "#d93025",
                        borderRadius: "7px",
                        padding: "7px 10px",
                        cursor: "pointer",
                        fontWeight: "700",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {message && (
            <div
              style={{
                marginTop: "20px",
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
            onClick={mergePDFs}
            disabled={files.length < 2 || loading}
            style={{
              width: "100%",
              marginTop: "22px",
              padding: "16px",
              border: "none",
              borderRadius: "12px",
              background:
                files.length < 2 || loading
                  ? "#94a3b8"
                  : "#1677ff",
              color: "#fff",
              fontSize: "17px",
              fontWeight: "800",
              cursor:
                files.length < 2 || loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading ? "Merging PDFs..." : "Merge PDFs"}
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
              ✓ Multiple PDFs
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
              ✓ Reorder Files
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
              ✓ Browser Based
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
