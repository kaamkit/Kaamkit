"use client";

import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import mammoth from "mammoth/mammoth.browser";

export default function WordToPDF() {
  const [file, setFile] = useState(null);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const previewRef = useRef(null);

  const handleFile = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const extension = selectedFile.name
      .split(".")
      .pop()
      .toLowerCase();

    if (extension !== "docx") {
      setMessage("Please select a .docx Word file.");
      setFile(null);
      setHtml("");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const arrayBuffer = await selectedFile.arrayBuffer();

      const result = await mammoth.convertToHtml(
        {
          arrayBuffer,
        },
        {
          styleMap: [
            "p[style-name='Title'] => h1:fresh",
            "p[style-name='Subtitle'] => h2:fresh",
            "p[style-name='Heading 1'] => h2:fresh",
            "p[style-name='Heading 2'] => h3:fresh",
            "p[style-name='Heading 3'] => h4:fresh",
          ],
        }
      );

      setFile(selectedFile);
      setHtml(result.value);

      if (result.messages?.length) {
        setMessage(
          "Word file loaded. Some advanced Word formatting may not be reproduced exactly."
        );
      } else {
        setMessage("Word file loaded successfully.");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Unable to read this Word file. Please try another .docx file."
      );
      setFile(null);
      setHtml("");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!file || !previewRef.current) {
      setMessage("Please select a Word file first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Creating PDF...");

      const element = previewRef.current;

      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: element.scrollWidth,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;

      const usableWidth = pageWidth - margin * 2;

      const imageHeight =
        (canvas.height * usableWidth) / canvas.width;

      let heightLeft = imageHeight;
      let position = margin;

      pdf.addImage(
        imgData,
        "JPEG",
        margin,
        position,
        usableWidth,
        imageHeight,
        undefined,
        "FAST"
      );

      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        position = margin - (imageHeight - heightLeft);

        pdf.addPage();

        pdf.addImage(
          imgData,
          "JPEG",
          margin,
          position,
          usableWidth,
          imageHeight,
          undefined,
          "FAST"
        );

        heightLeft -= pageHeight - margin * 2;
      }

      const outputName = file.name.replace(/\.docx$/i, "") + ".pdf";

      pdf.save(outputName);

      setMessage("PDF created successfully.");
    } catch (error) {
      console.error(error);
      setMessage(
        "PDF creation failed. Please try a smaller or simpler Word file."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setHtml("");
    setMessage("");

    const input = document.getElementById("word-file-input");

    if (input) {
      input.value = "";
    }
  };

  return (
    <main className="wordPdfPage">
      <header className="wordPdfHeader">
        <div className="wordPdfHeaderInner">
          <a href="/" className="brand">
            <span className="brandIcon">K</span>

            <span>
              Kaam<span className="brandBlue">Kit</span>
            </span>
          </a>

          <a href="/" className="homeLink">
            ← Home
          </a>
        </div>
      </header>

      <section className="wordPdfContainer">
        <div className="hero">
          <div className="heroIcon">📄</div>

          <h1>Word to PDF Converter</h1>

          <p>
            Convert your Word documents into PDF files quickly and easily.
          </p>
        </div>

        <div className="converterCard">
          <label className="uploadBox" htmlFor="word-file-input">
            <div className="uploadIcon">⬆</div>

            <strong>
              {file ? file.name : "Choose Word Document"}
            </strong>

            <span>
              {file
                ? "DOCX file selected"
                : "Select a .docx file from your device"}
            </span>

            <input
              id="word-file-input"
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFile}
              hidden
            />
          </label>

          {loading && (
            <div className="status loading">
              Processing...
            </div>
          )}

          {message && !loading && (
            <div className="status">
              {message}
            </div>
          )}

          {html && (
            <>
              <div className="previewTitle">
                Document Preview
              </div>

              <div className="previewOuter">
                <div
                  ref={previewRef}
                  className="documentPreview"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>

              <button
                type="button"
                className="downloadButton"
                onClick={downloadPDF}
                disabled={loading}
              >
                {loading ? "Creating PDF..." : "Download PDF"}
              </button>

              <button
                type="button"
                className="resetButton"
                onClick={reset}
                disabled={loading}
              >
                Choose Another File
              </button>
            </>
          )}

          <div className="features">
            <div>
              <span>✓</span>
              DOCX supported
            </div>

            <div>
              <span>✓</span>
              Works in browser
            </div>

            <div>
              <span>✓</span>
              No signup required
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .wordPdfPage {
          min-height: 100vh;
          background: #f4f8ff;
          color: #14213d;
          font-family: Arial, sans-serif;
        }

        .wordPdfHeader {
          background: #ffffff;
          border-bottom: 1px solid #e4ecf7;
          padding: 15px 20px;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .wordPdfHeaderInner {
          max-width: 1000px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #14213d;
          font-size: 25px;
          font-weight: 800;
        }

        .brandIcon {
          width: 43px;
          height: 43px;
          border-radius: 12px;
          background: #1677ff;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
        }

        .brandBlue {
          color: #1677ff;
        }

        .homeLink {
          color: #1677ff;
          text-decoration: none;
          font-weight: 700;
        }

        .wordPdfContainer {
          max-width: 900px;
          margin: auto;
          padding: 45px 18px 70px;
        }

        .hero {
          text-align: center;
          margin-bottom: 30px;
        }

        .heroIcon {
          width: 80px;
          height: 80px;
          margin: 0 auto 15px;
          border-radius: 22px;
          background: #e7f1ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        }

        .hero h1 {
          margin: 0 0 10px;
          font-size: 38px;
        }

        .hero p {
          margin: 0;
          color: #718096;
          font-size: 17px;
        }

        .converterCard {
          background: #ffffff;
          border: 1px solid #e0eaf6;
          border-radius: 24px;
          padding: 25px;
          box-shadow: 0 15px 45px rgba(30, 80, 140, 0.1);
        }

        .uploadBox {
          min-height: 190px;
          border: 2px dashed #9dbce5;
          border-radius: 18px;
          background: #f7fbff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          padding: 25px;
          transition: 0.2s;
        }

        .uploadBox:hover {
          border-color: #1677ff;
          background: #f0f7ff;
        }

        .uploadIcon {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: #1677ff;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          margin-bottom: 12px;
        }

        .uploadBox strong {
          font-size: 18px;
          margin-bottom: 7px;
          word-break: break-word;
        }

        .uploadBox span {
          color: #718096;
          font-size: 14px;
        }

        .status {
          margin-top: 18px;
          padding: 13px 15px;
          border-radius: 12px;
          background: #eef6ff;
          color: #24517d;
          text-align: center;
          font-size: 14px;
        }

        .loading {
          background: #fff7e6;
          color: #9a6500;
        }

        .previewTitle {
          font-size: 19px;
          font-weight: 800;
          margin: 28px 0 12px;
        }

        .previewOuter {
          background: #eef3f8;
          border: 1px solid #d8e2ed;
          border-radius: 14px;
          padding: 15px;
          overflow-x: auto;
          max-height: 700px;
          overflow-y: auto;
        }

        .documentPreview {
          width: 794px;
          min-height: 1123px;
          margin: 0 auto;
          padding: 55px;
          background: #ffffff;
          color: #111111;
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.55;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
        }

        .documentPreview h1 {
          font-size: 30px;
          margin: 0 0 20px;
        }

        .documentPreview h2 {
          font-size: 24px;
          margin: 20px 0 12px;
        }

        .documentPreview h3 {
          font-size: 20px;
          margin: 18px 0 10px;
        }

        .documentPreview h4 {
          font-size: 18px;
          margin: 15px 0 8px;
        }

        .documentPreview p {
          margin: 0 0 12px;
        }

        .documentPreview ul,
        .documentPreview ol {
          margin-top: 8px;
          margin-bottom: 15px;
          padding-left: 30px;
        }

        .documentPreview li {
          margin-bottom: 5px;
        }

        .documentPreview table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }

        .documentPreview td,
        .documentPreview th {
          border: 1px solid #777;
          padding: 7px;
          vertical-align: top;
        }

        .documentPreview img {
          max-width: 100%;
          height: auto;
        }

        .documentPreview a {
          color: #145dcc;
          text-decoration: underline;
        }

        .downloadButton {
          width: 100%;
          margin-top: 20px;
          padding: 16px;
          border: 0;
          border-radius: 12px;
          background: #1677ff;
          color: #ffffff;
          font-size: 17px;
          font-weight: 800;
          cursor: pointer;
        }

        .downloadButton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .resetButton {
          width: 100%;
          margin-top: 10px;
          padding: 14px;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          background: #ffffff;
          color: #14213d;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 22px;
        }

        .features div {
          background: #f5f9ff;
          border-radius: 12px;
          padding: 13px 8px;
          text-align: center;
          color: #52647a;
          font-size: 13px;
        }

        .features span {
          color: #16834b;
          font-weight: 900;
          margin-right: 5px;
        }

        @media (max-width: 600px) {
          .hero h1 {
            font-size: 30px;
          }

          .converterCard {
            padding: 16px;
          }

          .documentPreview {
            width: 794px;
            padding: 40px;
          }

          .features {
            grid-template-columns: 1fr;
          }

          .brand {
            font-size: 21px;
          }

          .brandIcon {
            width: 38px;
            height: 38px;
          }
        }
      `}</style>
    </main>
  );
}
