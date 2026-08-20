"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [keepRatio, setKeepRatio] = useState(true);
  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef(null);

  const uploadImage = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setFile(selected);
    setResult("");

    const url = URL.createObjectURL(selected);
    setPreview(url);

    const image = new Image();

    image.onload = () => {
      setOriginalWidth(image.width);
      setOriginalHeight(image.height);
      setWidth(image.width);
      setHeight(image.height);
    };

    image.src = url;
  };

  const changeWidth = (value) => {
    setWidth(value);

    if (
      keepRatio &&
      originalWidth > 0 &&
      originalHeight > 0 &&
      value
    ) {
      setHeight(
        Math.round(
          (Number(value) * originalHeight) /
            originalWidth
        )
      );
    }
  };

  const changeHeight = (value) => {
    setHeight(value);

    if (
      keepRatio &&
      originalWidth > 0 &&
      originalHeight > 0 &&
      value
    ) {
      setWidth(
        Math.round(
          (Number(value) * originalWidth) /
            originalHeight
        )
      );
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
      alert("Maximum size is 10000 × 10000 pixels.");
      return;
    }

    setLoading(true);

    const image = new Image();

    image.onload = () => {
      try {
        const canvas = canvasRef.current;

        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext("2d");

        ctx.clearRect(
          0,
          0,
          newWidth,
          newHeight
        );

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

        setResult(output);
      } catch (error) {
        console.error(error);
        alert("Unable to resize this image.");
      }

      setLoading(false);
    };

    image.onerror = () => {
      setLoading(false);
      alert("Unable to process this image.");
    };

    image.src = preview;
  };

  const downloadImage = () => {
    if (!result) {
      alert("Resize the image first.");
      return;
    }

    const extension =
      format === "image/png"
        ? "png"
        : "jpg";

    const name =
      file?.name?.replace(/\.[^/.]+$/, "") ||
      "kaamkit-image";

    const link = document.createElement("a");

    link.href = result;
    link.download =
      `${name}-${width}x${height}.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFile(null);
    setPreview("");
    setResult("");
    setWidth("");
    setHeight("");
    setOriginalWidth(0);
    setOriginalHeight(0);
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

      <nav className="navbar">

        <Link href="/" className="logo">

          <div className="logoIcon">
            K
          </div>

          <span>
            Kaam<span>Kit</span>
          </span>

        </Link>

        <div className="navLinks open">

          <Link href="/">Home</Link>
          <Link href="/#tools">Tools</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>

        </div>

      </nav>

      <section className="converterSection">

        <div className="sectionTitle">

          <div className="badge">
            ⚡ Free • Fast • Secure
          </div>

          <h1>Image Resizer</h1>

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
                accept="image/*"
                onChange={uploadImage}
                hidden
              />

            </label>

          ) : (

            <div className="previewArea">

              <img
                src={preview}
                alt="Original image"
                className="imagePreview"
              />

              <div className="fileName">
                {file.name}
              </div>

              <p style={{
                textAlign: "center",
                color: "#64748b"
              }}>
                Original size:{" "}
                {originalWidth} ×{" "}
                {originalHeight}px
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "16px",
                  marginTop: "24px"
                }}
              >

                <div>

                  <label>
                    Width (px)
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={width}
                    onChange={(e) =>
                      changeWidth(
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginTop: "8px",
                      borderRadius: "12px",
                      border:
                        "1px solid #dbe3ef",
                      fontSize: "16px"
                    }}
                  />

                </div>

                <div>

                  <label>
                    Height (px)
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={height}
                    onChange={(e) =>
                      changeHeight(
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginTop: "8px",
                      borderRadius: "12px",
                      border:
                        "1px solid #dbe3ef",
                      fontSize: "16px"
                    }}
                  />

                </div>

              </div>

              <label
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  marginTop: "20px"
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

              <div style={{
                marginTop: "20px"
              }}>

                <label>
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
                    marginTop: "8px",
                    borderRadius: "12px",
                    border:
                      "1px solid #dbe3ef",
                    fontSize: "16px"
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

              {format === "image/jpeg" && (

                <div style={{
                  marginTop: "20px"
                }}>

                  <label>
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
                      marginTop: "10px"
                    }}
                  />

                </div>

              )}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "25px"
                }}
              >

                <button
                  className="primaryButton"
                  onClick={resizeImage}
                  disabled={loading}
                >
                  {loading
                    ? "Resizing..."
                    : "Resize Image →"}
                </button>

                {result && (

                  <button
                    className="primaryButton"
                    onClick={downloadImage}
                  >
                    Download Image ↓
                  </button>

                )}

                <button
                  className="secondaryButton"
                  onClick={reset}
                >
                  Start Over
                </button>

              </div>

              {result && (

                <div style={{
                  marginTop: "30px",
                  textAlign: "center"
                }}>

                  <h3>
                    Resized Image
                  </h3>

                  <img
                    src={result}
                    alt="Resized result"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      marginTop: "15px",
                      borderRadius: "16px"
                    }}
                  />

                  <p style={{
                    color: "#64748b"
                  }}>
                    New size: {width} × {height}px
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

      <footer>

        <div className="footerBrand">

          <Link href="/" className="logo">

            <div className="logoIcon">
              K
            </div>

            <span>
              Kaam<span>Kit</span>
            </span>

          </Link>

          <p>
            Simple Tools. Better Work.
          </p>

        </div>

        <div>

          <h3>Quick Links</h3>

          <Link href="/">Home</Link>
          <Link href="/#tools">Tools</Link>
          <Link href="/#about">About</Link>

        </div>

        <div>

          <h3>Image Tools</h3>

          <Link href="/compressor">
            Image Compressor
          </Link>

          <Link href="/resizer">
            Image Resizer
          </Link>

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
