"use client";

import { useEffect, useRef, useState } from "react";

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [keepRatio, setKeepRatio] = useState(true);
  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(90);

  const [resizedPreview, setResizedPreview] = useState("");
  const [processing, setProcessing] = useState(false);

  const canvasRef = useRef(null);

  const handleFile = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    setFile(selectedFile);
    setResizedPreview("");

    const imageUrl = URL.createObjectURL(selectedFile);

    const image = new Image();

    image.onload = () => {
      setOriginalWidth(image.width);
      setOriginalHeight(image.height);

      setWidth(image.width);
      setHeight(image.height);

      setPreview(imageUrl);

      URL.revokeObjectURL(imageUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      alert("Unable to read this image.");
    };

    image.src = imageUrl;
  };

  const handleWidthChange = (value) => {
    setWidth(value);

    if (
      keepRatio &&
      originalWidth > 0 &&
      originalHeight > 0 &&
      value
    ) {
      const newHeight = Math.round(
        (Number(value) * originalHeight) /
          originalWidth
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
      value
    ) {
      const newWidth = Math.round(
        (Number(value) * originalWidth) /
          originalHeight
      );

      setWidth(newWidth);
    }
  };

  const resizeImage = () => {
    if (!file || !preview) {
      alert("Please upload an image first.");
      return;
    }

    const newWidth = Number(width);
    const newHeight = Number(height);

    if (
      !newWidth ||
      !newHeight ||
      newWidth < 1 ||
      newHeight < 1
    ) {
      alert("Please enter valid width and height.");
      return;
    }

    if (newWidth > 10000 || newHeight > 10000) {
      alert("Maximum size allowed is 10000 × 10000 pixels.");
      return;
    }

    setProcessing(true);

    const image = new Image();

    image.onload = () => {
      try {
        const canvas = canvasRef.current;

        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, newWidth, newHeight);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
          image,
          0,
          0,
          newWidth,
          newHeight
        );

        const output =
          format === "image/png"
            ? canvas.toDataURL("image/png")
            : canvas.toDataURL(
                "image/jpeg",
                quality / 100
              );

        setResizedPreview(output);
      } catch (error) {
        console.error(error);
        alert("Image resizing failed.");
      } finally {
        setProcessing(false);
      }
    };

    image.onerror = () => {
      setProcessing(false);
      alert("Unable to process this image.");
    };

    image.src = preview;
  };

  const downloadImage = () => {
    if (!resizedPreview) {
      alert("Please resize the image first.");
      return;
    }

    const extension =
      format === "image/png"
        ? "png"
        : "jpg";

    const originalName =
      file?.name?.replace(/\.[^/.]+$/, "") ||
      "kaamkit-resized-image";

    const link = document.createElement("a");

    link.href = resizedPreview;
    link.download =
      `${originalName}-${width}x${height}.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setFile(null);
    setPreview("");
    setResizedPreview("");
    setOriginalWidth(0);
    setOriginalHeight(0);
    setWidth("");
    setHeight("");
    setQuality(90);
    setFormat("image/jpeg");
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <main className="site">

      {/* NAVBAR */}

      <nav className="navbar">

        <a href="/" className="logo">

          <div className="logoIcon">
            K
          </div>

          <span>
            Kaam<span>Kit</span>
          </span>

        </a>

        <div className="navLinks open">

          <a href="/">Home</a>
          <a href="/#tools">Tools</a>
          <a href="/#about">About</a>
          <a href="/#contact">Contact</a>

        </div>

      </nav>

      {/* TOOL HEADER */}

      <section className="converterSection">

        <div className="sectionTitle">

          <div className="badge">
            ⚡ Free • Fast • Secure
          </div>

          <h1>
            Image Resizer
          </h1>

          <p>
            Resize your JPG, JPEG, PNG or WebP
            images to any dimension.
          </p>

        </div>

        <div className="converterCard">

          {!file ? (

            <label className="uploadBox">

              <div className="uploadIcon">
                🖼️
              </div>

              <h3>
                Upload Your Image
              </h3>

              <p>
                JPG, JPEG, PNG or WebP
              </p>

              <span className="uploadButton">
                Choose Image
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFile}
                hidden
              />

            </label>

          ) : (

            <div className="previewArea">

              {/* ORIGINAL IMAGE */}

              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "24px",
                }}
              >

                <img
                  src={preview}
                  alt="Original"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "320px",
                    objectFit: "contain",
                    borderRadius: "16px",
                  }}
                />

              </div>

              {/* FILE INFO */}

              <div className="fileName">
                {file.name}
              </div>

              <p
                style={{
                  textAlign: "center",
                  color: "#64748b",
                  marginBottom: "24px",
                }}
              >
                Original: {originalWidth} ×{" "}
                {originalHeight}px
              </p>

              {/* WIDTH / HEIGHT */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Width (px)
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={width}
                    onChange={(e) =>
                      handleWidthChange(
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "12px",
                      border:
                        "1px solid #dbe3ef",
                      fontSize: "16px",
                    }}
                  />

                </div>

                <div>

                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Height (px)
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={height}
                    onChange={(e) =>
                      handleHeightChange(
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "12px",
                      border:
                        "1px solid #dbe3ef",
                      fontSize: "16px",
                    }}
                  />

                </div>

              </div>

              {/* ASPECT RATIO */}

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                  fontWeight: "600",
                }}
              >

                <input
                  type="checkbox"
                  checked={keepRatio}
                  onChange={(e) =>
                    setKeepRatio(
                      e.target.checked
                    )
                  }
                />

                Keep aspect ratio

              </label>

              {/* FORMAT */}

              <div style={{ marginBottom: "20px" }}>

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  Output Format
                </label>

                <select
                  value={format}
                  onChange={(e) =>
                    setFormat(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border:
                      "1px solid #dbe3ef",
                    fontSize: "16px",
                    background: "white",
                  }}
                >

                  <option value="image/jpeg">
                    JPG
                  </option>

                  <option value="image/png">
                    PNG
                  </option>

                </select>

              </div>

              {/* QUALITY */}

              {format === "image/jpeg" && (

                <div
                  style={{
                    marginBottom: "24px",
                  }}
                >

                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    JPG Quality: {quality}%
                  </label>

                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) =>
                      setQuality(
                        Number(e.target.value)
                      )
                    }
                    style={{
                      width: "100%",
                    }}
                  />

                </div>

              )}

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >

                <button
                  className="primaryButton"
                  onClick={resizeImage}
                  disabled={processing}
                  type="button"
                >
                  {processing
                    ? "Resizing..."
                    : "Resize Image →"}
                </button>

                {resizedPreview && (

                  <button
                    className="primaryButton"
                    onClick={downloadImage}
                    type="button"
                  >
                    Download Image ↓
                  </button>

                )}

                <button
                  className="secondaryButton"
                  onClick={resetTool}
                  type="button"
                >
                  Start Over
                </button>

              </div>

              {/* RESULT */}

              {resizedPreview && (

                <div
                  style={{
                    marginTop: "32px",
                    paddingTop: "28px",
                    borderTop:
                      "1px solid #e2e8f0",
                  }}
                >

                  <h3
                    style={{
                      textAlign: "center",
                      marginBottom: "18px",
                    }}
                  >
                    Resized Image
                  </h3>

                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >

                    <img
                      src={resizedPreview}
                      alt="Resized result"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "400px",
                        objectFit: "contain",
                        borderRadius: "16px",
                      }}
                    />

                  </div>

                  <p
                    style={{
                      textAlign: "center",
                      color: "#64748b",
                      marginTop: "12px",
                    }}
                  >
                    New size: {width} ×{" "}
                    {height}px
                  </p>

                </div>

              )}

            </div>

          )}

        </div>

      </section>

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

      {/* FOOTER */}

      <footer>

        <div className="footerBrand">

          <div className="logo">

            <div className="logoIcon">
              K
            </div>

            <span>
              Kaam<span>Kit</span>
            </span>

          </div>

          <p>
            Simple Tools. Better Work.
          </p>

        </div>

        <div>

          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/#tools">Tools</a>
          <a href="/#about">About</a>

        </div>

        <div>

          <h3>Image Tools</h3>

          <a href="/compressor">
            Image Compressor
          </a>

          <a href="/resizer">
            Image Resizer
          </a>

        </div>

      </footer>

      <div className="copyright">

        <span>
          © 2026 KaamKit. All rights reserved.
        </span>

        <span>
          Made with ❤️ in India 🇮🇳
        </span>

      </div>

    </main>
  );
}
