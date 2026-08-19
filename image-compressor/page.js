"use client";

import { useState } from "react";

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(70);
  const [preview, setPreview] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

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

    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  };

  const compressImage = () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert("Compression failed.");
            return;
          }

          const url = URL.createObjectURL(blob);

          setCompressedUrl(url);
          setCompressedSize(blob.size);
        },
        "image/jpeg",
        quality / 100
      );
    };

    img.src = URL.createObjectURL(file);
  };

  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Image Compressor</h1>

      <p>
        Compress your images online for free without installing any software.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
      />

      {preview && (
        <div style={{ marginTop: "25px" }}>
          <h3>Selected Image</h3>

          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: "10px",
            }}
          />

          <p>
            Original size: <strong>{formatSize(originalSize)}</strong>
          </p>

          <label>
            Compression Quality: <strong>{quality}%</strong>
          </label>

          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            style={{
              width: "100%",
              margin: "15px 0",
            }}
          />

          <button
            onClick={compressImage}
            style={{
              padding: "12px 20px",
              cursor: "pointer",
              borderRadius: "8px",
              border: "none",
            }}
          >
            Compress Image
          </button>
        </div>
      )}

      {compressedUrl && (
        <div style={{ marginTop: "30px" }}>
          <h3>Compression Complete ✅</h3>

          <p>
            Compressed size:{" "}
            <strong>{formatSize(compressedSize)}</strong>
          </p>

          <p>
            Size reduced by:{" "}
            <strong>
              {originalSize
                ? Math.max(
                    0,
                    Math.round(
                      ((originalSize - compressedSize) / originalSize) * 100
                    )
                  )
                : 0}
              %
            </strong>
          </p>

          <a
            href={compressedUrl}
            download="kaamkit-compressed.jpg"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Download Compressed Image
          </a>
        </div>
      )}
    </main>
  );
                }
