"use client";

import { useState } from "react";

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(70);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setCompressedUrl(null);
    setCompressedSize(0);
  };

  const compressImage = () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              alert("Compression failed.");
              setLoading(false);
              return;
            }

            const url = URL.createObjectURL(blob);

            setCompressedUrl(url);
            setCompressedSize(blob.size);
            setLoading(false);
          },
          "image/jpeg",
          quality / 100
        );
      };

      image.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) {
      return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
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
        Image Compressor
      </p>

      <div
        style={{
          border: "2px dashed #999",
          borderRadius: "12px",
          padding: "35px 20px",
          marginTop: "30px",
        }}
      >
        <h2>Select Image</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ marginTop: "15px" }}
        />

        {file && (
          <p style={{ marginTop: "20px" }}>
            Selected: {file.name}
          </p>
        )}

        <div style={{ marginTop: "25px" }}>
          <label>
            Compression Quality: <strong>{quality}%</strong>
          </label>

          <br />

          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            style={{
              width: "80%",
              marginTop: "15px",
            }}
          />
        </div>

        <button
          onClick={compressImage}
          disabled={loading || !file}
          style={{
            marginTop: "25px",
            padding: "14px 25px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "none",
            background: !file ? "#aaa" : "#111",
            color: "white",
            cursor: !file ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Compressing..." : "Compress Image"}
        </button>

        {originalSize > 0 && compressedSize > 0 && (
          <div style={{ marginTop: "25px" }}>
            <p>
              Original Size: <strong>{formatSize(originalSize)}</strong>
            </p>

            <p>
              Compressed Size:{" "}
              <strong>{formatSize(compressedSize)}</strong>
            </p>
          </div>
        )}

        {compressedUrl && (
          <a
            href={compressedUrl}
            download="KaamKit-Compressed.jpg"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "14px 25px",
              background: "#111",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "18px",
            }}
          >
            Download Compressed Image
          </a>
        )}
      </div>

      <p style={{ marginTop: "30px", color: "#777" }}>
        Your image is compressed directly in your browser.
      </p>
    </main>
  );
          }
