"use client";

import { useState } from "react";

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();

    reader.onload = (event) => {
      const image = new Image();

      image.onload = () => {
        setOriginalWidth(image.width);
        setOriginalHeight(image.height);
        setWidth(image.width);
        setHeight(image.height);
        setPreview(event.target.result);
      };

      image.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleWidthChange = (value) => {
    setWidth(value);

    if (
      keepRatio &&
      originalWidth > 0 &&
      originalHeight > 0 &&
      value !== ""
    ) {
      const newHeight = Math.round(
        (Number(value) / originalWidth) * originalHeight
      );

      setHeight(newHeight);
    }
  };

  const handleHeightChange = (value) => {
    setHeight(value);

    if (
      keepRatio &&
      originalWidth > 0 &&
      originalHeight > 0 &&
      value !== ""
    ) {
      const newWidth = Math.round(
        (Number(value) / originalHeight) * originalWidth
      );

      setWidth(newWidth);
    }
  };

  const resizeImage = () => {
    if (!file || !preview) {
      alert("Please select an image first.");
      return;
    }

    const newWidth = Number(width);
    const newHeight = Number(height);

    if (!newWidth || !newHeight || newWidth <= 0 || newHeight <= 0) {
      alert("Please enter valid width and height.");
      return;
    }

    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert("Unable to resize image.");
            return;
          }

          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;

          const originalName = file.name.replace(/\.[^/.]+$/, "");

          link.download = `${originalName}-${newWidth}x${newHeight}.jpg`;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(url);
        },
        "image/jpeg",
        0.92
      );
    };

    image.onerror = () => {
      alert("Unable to process this image.");
    };

    image.src = preview;
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f8fc",
        padding: "30px 16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-block",
            marginBottom: "25px",
            textDecoration: "none",
            color: "#1769e0",
            fontWeight: "600",
          }}
        >
          ← Back to KaamKit
        </a>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "30px 20px",
            boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
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
                width: "75px",
                height: "75px",
                borderRadius: "20px",
                background: "#eaf4ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                margin: "0 auto 18px",
              }}
            >
              ↗️
            </div>

            <h1
              style={{
                margin: "0 0 10px",
                color: "#10264b",
                fontSize: "32px",
              }}
            >
              Image Resizer
            </h1>

            <p
              style={{
                margin: 0,
                color: "#718096",
                fontSize: "16px",
              }}
            >
              Resize your images to any dimension.
            </p>
          </div>

          <label
            htmlFor="image-upload"
            style={{
              display: "block",
              border: "2px dashed #b8cbe5",
              borderRadius: "18px",
              padding: "30px 15px",
              textAlign: "center",
              cursor: "pointer",
              background: "#f8fbff",
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                fontSize: "42px",
                marginBottom: "10px",
              }}
            >
              🖼️
            </div>

            <strong
              style={{
                display: "block",
                color: "#10264b",
                fontSize: "18px",
                marginBottom: "6px",
              }}
            >
              Select Image
            </strong>

            <span
              style={{
                color: "#718096",
                fontSize: "14px",
              }}
            >
              JPG, JPEG, PNG or WebP
            </span>

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>

          {file && (
            <div
              style={{
                background: "#f7fafc",
                borderRadius: "14px",
                padding: "15px",
                marginBottom: "20px",
                color: "#334155",
                fontSize: "14px",
              }}
            >
              <strong>Selected:</strong> {file.name}
              <br />
              <strong>Original size:</strong> {originalWidth} ×{" "}
              {originalHeight}px
            </div>
          )}

          {preview && (
            <div
              style={{
                textAlign: "center",
                marginBottom: "25px",
              }}
            >
              <img
                src={preview}
                alt="Selected image"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  objectFit: "contain",
                }}
              />
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "18px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#334155",
                  fontWeight: "600",
                }}
              >
                Width (px)
              </label>

              <input
                type="number"
                min="1"
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                placeholder="Width"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#334155",
                  fontWeight: "600",
                }}
              >
                Height (px)
              </label>

              <input
                type="number"
                min="1"
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                placeholder="Height"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "25px",
              color: "#334155",
              fontSize: "15px",
            }}
          >
            <input
              type="checkbox"
              checked={keepRatio}
              onChange={(e) => setKeepRatio(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
              }}
            />

            Keep aspect ratio
          </label>

          <button
            type="button"
            onClick={resizeImage}
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background: "#1769e0",
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Resize & Download →
          </button>

          <p
            style={{
              textAlign: "center",
              color: "#718096",
              fontSize: "13px",
              marginTop: "18px",
              marginBottom: 0,
            }}
          >
            Your image is processed directly in your browser.
          </p>
        </div>
      </div>
    </main>
  );
}
