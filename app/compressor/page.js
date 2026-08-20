"use client";

import { useState } from "react";

export default function Compressor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quality, setQuality] = useState(70);
  const [compressedSize, setCompressedSize] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);

  const handleFile = (e) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    setFile(selected);
    setOriginalSize(selected.size);
    setCompressedSize(null);

    const reader = new FileReader();

    reader.onload = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(selected);
  };

  const compressImage = () => {
    if (!file || !preview) {
      alert("Please select an image first.");
      return;
    }

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
            alert("Compression failed. Please try another image.");
            return;
          }

          setCompressedSize(blob.size);

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.href = url;
          link.download =
            file.name.replace(/\.[^/.]+$/, "") + "-compressed.jpg";

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(url);
        },
        "image/jpeg",
        quality / 100
      );
    };

    image.src = preview;
  };

  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";

    return (bytes / 1024).toFixed(1) + " KB";
  };

  return (
    <main style={styles.page}>
      <nav style={styles.nav}>
        <a href="/" style={styles.logo}>
          <div style={styles.logoIcon}>K</div>
          <span>
            Kaam<span style={{ color: "#0878ff" }}>Kit</span>
          </span>
        </a>

        <a href="/" style={styles.home}>
          ← Back to KaamKit
        </a>
      </nav>

      <section style={styles.hero}>
        <div style={styles.badge}>⚡ Free • Fast • Secure</div>

        <h1 style={styles.title}>
          Image <span style={{ color: "#0878ff" }}>Compressor</span>
        </h1>

        <p style={styles.subtitle}>
          Reduce image file size quickly without uploading your files
          to a server.
        </p>

        <div style={styles.card}>
          {!preview ? (
            <label style={styles.uploadBox}>
              <div style={styles.uploadIcon}>🖼️</div>

              <h2 style={styles.uploadTitle}>
                Upload your image
              </h2>

              <p style={styles.uploadText}>
                JPG, JPEG or PNG supported
              </p>

              <span style={styles.button}>
                Choose Image
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                hidden
              />
            </label>
          ) : (
            <>
              <img
                src={preview}
                alt="Preview"
                style={styles.preview}
              />

              <div style={styles.fileName}>
                {file?.name}
              </div>

              <div style={styles.info}>
                <span>
                  Original: <strong>{formatSize(originalSize)}</strong>
                </span>

                {compressedSize && (
                  <span>
                    Compressed:{" "}
                    <strong>{formatSize(compressedSize)}</strong>
                  </span>
                )}
              </div>

              <div style={styles.sliderBox}>
                <div style={styles.sliderHeader}>
                  <strong>Compression Quality</strong>
                  <strong>{quality}%</strong>
                </div>

                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) =>
                    setQuality(Number(e.target.value))
                  }
                  style={styles.slider}
                />

                <div style={styles.rangeLabels}>
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>

              <div style={styles.actions}>
                <label style={styles.secondaryButton}>
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    hidden
                  />
                </label>

                <button
                  onClick={compressImage}
                  style={styles.primaryButton}
                >
                  Compress & Download →
                </button>
              </div>
            </>
          )}
        </div>

        <div style={styles.features}>
          <div>🔒 Files stay on your device</div>
          <div>⚡ Fast processing</div>
          <div>💯 Free to use</div>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>K</div>
          <span>
            Kaam<span style={{ color: "#0878ff" }}>Kit</span>
          </span>
        </div>

        <p>
          Simple Tools. Better Work. • Made with ❤️ in India 🇮🇳
        </p>
      </footer>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #eef8ff 0%, #ffffff 55%, #eaf4ff 100%)",
    color: "#10213f",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  nav: {
    height: "72px",
    padding: "0 7%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255,255,255,.96)",
    borderBottom: "1px solid #e5edf7",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "27px",
    fontWeight: "800",
    color: "#12213f",
    textDecoration: "none",
  },

  logoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    display: "grid",
    placeItems: "center",
    color: "white",
    fontSize: "27px",
    fontWeight: "900",
    background: "linear-gradient(135deg,#0878ff,#1647d8)",
  },

  home: {
    color: "#0878ff",
    fontWeight: "700",
    textDecoration: "none",
  },

  hero: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "70px 20px 90px",
    textAlign: "center",
  },

  badge: {
    display: "inline-block",
    padding: "9px 18px",
    borderRadius: "30px",
    background: "#0878ff",
    color: "white",
    fontWeight: "700",
  },

  title: {
    fontSize: "52px",
    margin: "22px 0 12px",
  },

  subtitle: {
    color: "#64758c",
    fontSize: "18px",
    lineHeight: "1.6",
    maxWidth: "650px",
    margin: "0 auto 35px",
  },

  card: {
    background: "white",
    border: "1px solid #dfeaf6",
    borderRadius: "25px",
    padding: "35px",
    boxShadow: "0 20px 50px rgba(30,80,130,.12)",
  },

  uploadBox: {
    display: "block",
    padding: "55px 20px",
    border: "2px dashed #b9d7f5",
    borderRadius: "20px",
    cursor: "pointer",
    background: "#f8fcff",
  },

  uploadIcon: {
    fontSize: "55px",
    marginBottom: "15px",
  },

  uploadTitle: {
    margin: "0 0 8px",
    fontSize: "24px",
  },

  uploadText: {
    color: "#718096",
    marginBottom: "25px",
  },

  button: {
    display: "inline-block",
    padding: "13px 25px",
    borderRadius: "28px",
    background: "#0878ff",
    color: "white",
    fontWeight: "700",
  },

  preview: {
    maxWidth: "100%",
    maxHeight: "350px",
    borderRadius: "15px",
    objectFit: "contain",
    marginBottom: "15px",
  },

  fileName: {
    fontWeight: "700",
    marginBottom: "20px",
    wordBreak: "break-word",
  },

  info: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    flexWrap: "wrap",
    color: "#64758c",
    marginBottom: "25px",
  },

  sliderBox: {
    maxWidth: "600px",
    margin: "0 auto 25px",
    textAlign: "left",
  },

  sliderHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  slider: {
    width: "100%",
    accentColor: "#0878ff",
  },

  rangeLabels: {
    display: "flex",
    justifyContent: "space-between",
    color: "#718096",
    fontSize: "13px",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  primaryButton: {
    border: "none",
    borderRadius: "28px",
    padding: "14px 25px",
    background: "#0878ff",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid #cbd9e8",
    borderRadius: "28px",
    padding: "13px 22px",
    background: "white",
    color: "#30445f",
    fontWeight: "700",
    cursor: "pointer",
  },

  features: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    flexWrap: "wrap",
    marginTop: "30px",
    color: "#52627b",
    fontWeight: "600",
  },

  footer: {
    padding: "30px 7%",
    background: "#0d1c35",
    color: "#a9b6c9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
};
