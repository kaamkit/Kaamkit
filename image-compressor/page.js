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
    if (bytes < 1024) return bytes + " B";
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
      <h1 style={{ fontSize: "42px" }}>
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
            style={{ width: "80%", marginTop: "15px" }}
          />
        </div>

        <br />

        <button
         
