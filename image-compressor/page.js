"use client";

import { useState } from "react";

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(70);
  const [preview, setPreview] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);

  const handleFile = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setCompressedSize(null);
  };

  const compressImage = () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const compressionQuality = quality / 100;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert("Compression failed.");
            return;
          }

          setCompressedSize(blob.size);

          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.href = downloadUrl;
          link.download = "KaamKit-compressed-image.jpg";
          link.click();

          URL.revokeObjectURL(downloadUrl);
        },
        "image/jpeg",
        compressionQuality
      );
    };
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024)
      return (bytes / 1024).toFixed(1) + " KB";

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
      <h1 style={{ fontSize: "40px" }}>
        KaamKit
      </h1>

      <h2>Image Compressor</h2>

      <p style={{ color: "#666" }}>
        Compress your image and download a smaller file.
      </p>

      <div
        style={{
          border: "2px dashed #999",
          borderRadius: "12px",
          padding: "35px 20px",
          marginTop: "30px",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
        />

        {file && (
          <div style={{ marginTop: "20px" }}>
            <p>
              <strong>Original:</strong>{" "}
              {formatSize(file.size)}
            </p>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            )}

            <div style={{ marginTop: "25px" }}>
              <label>
                Compression Quality:{" "}
                <strong>{quality}%</strong>
              </label>

              <br />

              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) =>
                  setQuality(Number(e.target.value))
                }
                style={{
                  width: "80%",
                  marginTop: "15px",
                }}
              />
            </div>

            <button
              onClick={compressImage}
              style={{
                marginTop: "25px",
                padding: "14px 25px",
                fontSize: "18px",
                borderRadius: "8px",
                border: "none",
                background: "#111",
                color: "white",
                cursor: "pointer",
              }}
            >
              Compress & Download
            </button>

            {compressedSize && (
              <p style={{ marginTop: "20px" }}>
                Compressed Size:{" "}
                <strong>{formatSize(compressedSize)}</strong>
              </p>
            )}
          </div>
        )}
      </div>

      <p style={{ marginTop: "30px", color: "#777" }}>
        Your image is processed in your browser.
      </p>
    </main>
  );
}
