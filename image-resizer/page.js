"use client";

import { useState } from "react";

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setFile(selectedFile);

    const image = new Image();

    image.onload = () => {
      setWidth(image.width);
      setHeight(image.height);
    };

    image.src = URL.createObjectURL(selectedFile);
  };

  const resizeImage = () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    if (!width || !height) {
      alert("Please enter width and height.");
      return;
    }

    setLoading(true);

    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = Number(width);
      canvas.height = Number(height);

      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        0,
        0,
        Number(width),
        Number(height)
      );

      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = "KaamKit-Resized-Image.jpg";
          link.click();

          URL.revokeObjectURL(url);
          setLoading(false);
        },
        "image/jpeg",
        0.9
      );
    };

    image.src = URL.createObjectURL(file);
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
        Image Resizer
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
          <>
            <p style={{ marginTop: "20px" }}>
              Selected: {file.name}
            </p>

            <div style={{ marginTop: "20px" }}>
              <label>Width (px)</label>
              <br />

              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                style={{
                  padding: "10px",
                  marginTop: "8px",
                  width: "150px",
                  fontSize: "16px",
                }}
              />
            </div>

            <div style={{ marginTop: "15px" }}>
              <label>Height (px)</label>
              <br />

              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                style={{
                  padding: "10px",
                  marginTop: "8px",
                  width: "150px",
                  fontSize: "16px",
                }}
              />
            </div>

            <button
              onClick={resizeImage}
              disabled={loading}
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
              {loading ? "Resizing..." : "Resize & Download"}
            </button>
          </>
        )}
      </div>

      <p style={{ marginTop: "30px", color: "#777" }}>
        Your image is resized directly in your browser.
      </p>
    </main>
  );
}
