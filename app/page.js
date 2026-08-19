"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    const jpgFiles = selectedFiles.filter(
      (file) =>
        file.type === "image/jpeg" || file.type === "image/jpg"
    );

    setFiles(jpgFiles);
  };

  const createPDF = async () => {
    if (files.length === 0) {
      alert("Please select JPG images first.");
      return;
    }

    setLoading(true);

    try {
      const pdf = new jsPDF("p", "mm", "a4");

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const imageData = await new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;

          reader.readAsDataURL(file);
        });

        const image = new Image();

        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
          image.src = imageData;
        });

        if (i > 0) {
          pdf.addPage();
        }

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;

        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - margin * 2;

        let width = image.width;
        let height = image.height;

        const ratio = Math.min(
          maxWidth / width,
          maxHeight / height
        );

        width = width * ratio;
        height = height * ratio;

        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        pdf.addImage(
          imageData,
          "JPEG",
          x,
          y,
          width,
          height
        );
      }

      pdf.save("KaamKit-JPG-to-PDF.pdf");
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
        KaamKit
      </h1>

      <p style={{ fontSize: "20px", color: "#555" }}>
        JPG to PDF Converter
      </p>

      <div
        style={{
          border: "2px dashed #999",
          borderRadius: "12px",
          padding: "35px 20px",
          marginTop: "30px",
        }}
      >
        <h2>Select JPG Images</h2>

        <input
          type="file"
          accept="image/jpeg,image/jpg"
          multiple
          onChange={handleFiles}
          style={{ marginTop: "15px" }}
        />

        {files.length > 0 && (
          <p style={{ marginTop: "20px" }}>
            {files.length} image{files.length > 1 ? "s" : ""} selected
          </p>
        )}

        <button
          onClick={createPDF}
          disabled={loading || files.length === 0}
          style={{
            marginTop: "25px",
            padding: "14px 25px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "none",
            background: files.length === 0 ? "#aaa" : "#111",
            color: "white",
            cursor: files.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating PDF..." : "Create PDF"}
        </button>
      </div>

      <p style={{ marginTop: "30px", color: "#777" }}>
        Your images are processed in your browser.
      </p>
    </main>
  );
      }
