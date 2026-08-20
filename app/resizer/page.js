"use client";

import { useRef, useState } from "react";

export default function ImageResizer() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [quality, setQuality] = useState(0.9);
  const [loading, setLoading] = useState(false);

  const handleFile = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select a JPG, JPEG, PNG or WebP image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        setFile(selectedFile);
        setPreview(reader.result);
        setOriginalWidth(image.width);
        setOriginalHeight(image.height);
        setWidth(image.width);
        setHeight(image.height);
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleWidthChange = (value) => {
    const newWidth = Number(value);

    setWidth(value);

    if (
      lockRatio &&
      originalWidth > 0 &&
      originalHeight > 0 &&
      newWidth > 0
    ) {
      const newHeight = Math.round(
        (newWidth / originalWidth) * originalHeight
      );

      setHeight(newHeight);
    }
  };

  const handleHeightChange = (value) => {
    const newHeight = Number(value);

    setHeight(value);

    if (
      lockRatio &&
      originalWidth > 0 &&
      originalHeight > 0 &&
      newHeight > 0
    ) {
      const newWidth = Math.round(
        (newHeight / originalHeight) * originalWidth
      );

      setWidth(newWidth);
    }
  };

  const resizeImage = () => {
    if (!file || !preview) {
      alert("Please select an image first.");
      return;
    }

    if (!width || !height || Number(width) <= 0 || Number(height) <= 0) {
      alert("Please enter valid width and height.");
      return;
    }

    setLoading(true);

    const image = new Image();

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = Number(width);
        canvas.height = Number(height);

        ctx.drawImage(
          image,
          0,
          0,
          Number(width),
          Number(height)
        );

        let outputType = file.type;

        if (
          outputType !== "image/jpeg" &&
          outputType !== "image/png" &&
          outputType !== "image/webp"
        ) {
          outputType = "image/jpeg";
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              alert("Unable to resize image.");
              setLoading(false);
              return;
            }

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            const originalName = file.name.replace(/\.[^/.]+$/, "");

            let extension = "jpg";

            if (outputType === "image/png") {
              extension = "png";
            }

            if (outputType === "image/webp") {
              extension = "webp";
            }

            link.href = url;
            link.download = `${originalName}-resized.${extension}`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            setLoading(false);
          },
          outputType,
          Number(quality)
        );
      } catch (error) {
        console.error(error);
        alert("Something went wrong while resizing the image.");
        setLoading(false);
      }
    };

    image.onerror = () => {
      alert("Unable to read this image.");
      setLoading(false);
    };

    image.src = preview;
  };

  const resetTool = () => {
    setFile(null);
    setPreview("");
    setWidth("");
    setHeight("");
    setOriginalWidth(0);
    setOriginalHeight(0);
    setLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f9ff",
        color: "#14213d",
        paddingBottom: "60px",
      }}
    >
      {/* HEADER */}

      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5edf7",
          padding: "18px 20px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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

      {/* TOOL */}

      <section
        style={{
          maxWidth: "850px",
          margin: "0 auto",
          padding: "45px 20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              display: "inline-block",
              background: "#e8f2ff",
              padding: "12px 18px",
              borderRadius: "50px",
              marginBottom: "15px",
              fontSize: "28px",
            }}
          >
            ↗️
          </div>

          <h1
            style={{
              fontSize: "38px",
              margin: "0 0 10px",
            }}
          >
            Image Resizer
          </h1>

          <p
            style={{
              color: "#718096",
              fontSize: "18px",
              margin: 0,
            }}
          >
            Resize your images to any dimension quickly and easily.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "25px",
            boxShadow: "0 15px 45px rgba(30, 80, 140, 0.10)",
            border: "1px solid #e5edf7",
          }}
        >
          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed #9fc5f8",
                borderRadius: "20px",
                padding: "55px 20px",
                textAlign: "center",
                cursor: "pointer",
                background: "#f8fbff",
              }}
            >
              <div style={{ fontSize: "55px", marginBottom: "15px" }}>
                🖼️
              </div>

              <h2 style={{ margin: "0 0 10px" }}>
                Upload an Image
              </h2>

              <p style={{ color: "#718096" }}>
                JPG, JPEG, PNG or WebP
              </p>

              <button
                type="button"
                style={{
                  marginTop: "10px",
                  border: "none",
                  background: "#1677ff",
                  color: "#ffffff",
                  padding: "14px 25px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Choose Image
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFile}
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <>
              {/* PREVIEW */}

              <div
                style={{
                  textAlign: "center",
                  marginBottom: "25px",
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "320px",
                    borderRadius: "15px",
                    objectFit: "contain",
                    border: "1px solid #e5edf7",
                  }}
                />

                <p
                  style={{
                    marginTop: "12px",
                    color: "#718096",
                    wordBreak: "break-word",
                  }}
                >
                  {file?.name}
                </p>

                <p
                  style={{
                    fontSize: "14px",
                    color: "#718096",
                  }}
                >
                  Original: {originalWidth} × {originalHeight} px
                </p>
              </div>

              {/* SIZE */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "700",
                      marginBottom: "8px",
                    }}
                  >
                    Width (px)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={width}
                    onChange={(e) =>
                      handleWidthChange(e.target.value)
                    }
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1px solid #cbd5e1",
                      fontSize: "16px",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "700",
                      marginBottom: "8px",
                    }}
                  >
                    Height (px)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={height}
                    onChange={(e) =>
                      handleHeightChange(e.target.value)
                    }
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1px solid #cbd5e1",
                      fontSize: "16px",
                    }}
                  />
                </div>
              </div>

              {/* RATIO */}

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "18px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={lockRatio}
                  onChange={(e) =>
                    setLockRatio(e.target.checked)
                  }
                />

                <span>Lock aspect ratio</span>
              </label>

              {/* QUALITY */}

              <div style={{ marginTop: "25px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "700",
                    marginBottom: "10px",
                  }}
                >
                  Image Quality: {Math.round(quality * 100)}%
                </label>

                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) =>
                    setQuality(Number(e.target.value))
                  }
                  style={{
                    width: "100%",
                  }}
                />
              </div>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "28px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={resizeImage}
                  disabled={loading}
                  style={{
                    flex: 1,
                    minWidth: "180px",
                    border: "none",
                    background: "#1677ff",
                    color: "#ffffff",
                    padding: "15px 20px",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: loading ? "wait" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading
                    ? "Resizing..."
                    : "Resize & Download →"}
                </button>

                <button
                  type="button"
                  onClick={resetTool}
                  style={{
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#14213d",
                    padding: "15px 20px",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Change Image
                </button>
              </div>
            </>
          )}
        </div>

        {/* INFO */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "16px",
              textAlign: "center",
              border: "1px solid #e5edf7",
            }}
          >
            ⚡
            <strong
              style={{
                display: "block",
                marginTop: "8px",
              }}
            >
              Fast
            </strong>
            <small>Instant browser processing</small>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "16px",
              textAlign: "center",
              border: "1px solid #e5edf7",
            }}
          >
            🛡️
            <strong
              style={{
                display: "block",
                marginTop: "8px",
              }}
            >
              Private
            </strong>
            <small>Your image stays on your device</small>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "16px",
              textAlign: "center",
              border: "1px solid #e5edf7",
            }}
          >
            💯
            <strong
              style={{
                display: "block",
                marginTop: "8px",
              }}
            >
              Free
            </strong>
            <small>No signup required</small>
          </div>
        </div>
      </section>
    </main>
  );
}
