"use client";

import Link from "next/link";
import { useState } from "react";
import { jsPDF } from "jspdf";

const tools = [
  {
    name: "JPG to PDF",
    icon: "📄",
    description: "Convert JPG, JPEG or PNG images to PDF easily.",
    href: "#jpg-pdf",
    active: true,
  },
  {
    name: "Image Compressor",
    icon: "🗜️",
    description: "Reduce image size quickly and easily.",
    href: "/compressor",
    active: true,
  },
  {
    name: "Image Resizer",
    icon: "↗️",
    description: "Resize your images to any dimension.",
    href: "/resizer",
    active: true,
  },
  {
    name: "PDF to Word",
    icon: "📝",
    description: "Convert PDF documents into editable Word files.",
    href: "#tools",
    active: false,
  },
  {
    name: "PDF to Excel",
    icon: "📊",
    description: "Convert PDF tables into Excel files.",
    href: "#tools",
    active: false,
  },
  {
    name: "Word to Excel",
    icon: "📋",
    description: "Convert Word data into Excel format.",
    href: "#tools",
    active: false,
  },
  {
    name: "Word to PDF",
    icon: "📑",
    description: "Convert Word documents into PDF.",
    href: "#tools",
    active: false,
  },
  {
    name: "Excel to PDF",
    icon: "📈",
    description: "Convert Excel files into PDF.",
    href: "#tools",
    active: false,
  },
  {
    name: "GST Calculator",
    icon: "₹",
    description: "Calculate GST, tax and final amount.",
    href: "#tools",
    active: false,
  },
  {
    name: "QR Generator",
    icon: "▦",
    description: "Create QR codes for text and links.",
    href: "#tools",
    active: false,
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const convertToPDF = () => {
    if (!selectedFile || !preview) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);

    const image = new Image();

    image.onload = () => {
      try {
        const pdf = new jsPDF({
          orientation:
            image.width > image.height
              ? "landscape"
              : "portrait",
          unit: "px",
          format: [image.width, image.height],
        });

        const format =
          selectedFile.type === "image/png"
            ? "PNG"
            : "JPEG";

        pdf.addImage(
          image,
          format,
          0,
          0,
          image.width,
          image.height
        );

        const fileName =
          selectedFile.name.replace(/\.[^/.]+$/, "") +
          ".pdf";

        pdf.save(fileName);
      } catch (error) {
        console.error(error);
        alert("PDF creation failed.");
      } finally {
        setLoading(false);
      }
    };

    image.onerror = () => {
      setLoading(false);
      alert("Unable to process this image.");
    };

    image.src = preview;
  };

  return (
    <main className="site">

      <nav className="navbar">

        <Link href="/" className="logo">
          <div className="logoIcon">K</div>

          <span>
            Kaam<span>Kit</span>
          </span>
        </Link>

        <button
          className="menuBtn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          ☰
        </button>

        <div className={`navLinks ${menuOpen ? "open" : ""}`}>
          <Link href="/">Home</Link>
          <Link href="/#tools">Tools</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>
        </div>

      </nav>

      <section className="hero" id="home">

        <div className="heroContent">

          <div className="badge">
            ⚡ Free • Fast • Secure
          </div>

          <h1>
            Your Everyday
            <br />
            <span>Work Toolkit</span>
          </h1>

          <p>
            Simple, powerful and free online tools
            to make your daily work easier.
          </p>

          <div className="searchBox">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search tools..."
            />

            <button type="button">
              Search
            </button>
          </div>

          <div className="trust">
            <span>✓ 100% Free</span>
            <span>✓ No Sign Up</span>
            <span>✓ Works on All Devices</span>
          </div>

        </div>

        <div className="heroVisual">

          <div className="floatingCard card1">
            📄 PDF
          </div>

          <div className="floatingCard card2">
            🖼️ Image
          </div>

          <div className="floatingCard card3">
            ₹ GST
          </div>

          <div className="laptop">
            <div className="screen">
              <div className="bigK">K</div>
              <strong>KaamKit</strong>
            </div>

            <div className="keyboard"></div>
          </div>

        </div>

      </section>

      <section className="converterSection" id="jpg-pdf">

        <div className="sectionTitle">

          <h2>JPG to PDF Converter</h2>

          <p>
            Convert your JPG, JPEG or PNG image
            into a PDF instantly.
          </p>

        </div>

        <div className="converterCard">

          {!preview ? (

            <label className="uploadBox">

              <div className="uploadIcon">📤</div>

              <h3>Upload an Image</h3>

              <p>JPG, JPEG or PNG</p>

              <span className="uploadButton">
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

            <div className="previewArea">

              <img
                src={preview}
                alt="Selected image"
                className="imagePreview"
              />

              <div className="fileName">
                {selectedFile?.name}
              </div>

              <div className="converterActions">

                <label className="secondaryButton">

                  Change Image

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    hidden
                  />

                </label>

                <button
                  className="primaryButton"
                  onClick={convertToPDF}
                  disabled={loading}
                >
                  {loading
                    ? "Creating PDF..."
                    : "Download PDF →"}
                </button>

              </div>

            </div>

          )}

        </div>

      </section>

      <section className="toolsSection" id="tools">

        <div className="sectionTitle">

          <h2>Our Tools</h2>

          <p>
            Choose a tool and get your work done
            in seconds.
          </p>

        </div>

        <div className="toolGrid">

          {tools.map((tool) => (

            <div className="toolCard" key={tool.name}>

              <div className="toolIcon">
                {tool.icon}
              </div>

              <h3>{tool.name}</h3>

              <p>{tool.description}</p>

              {tool.active ? (

                <Link
                  href={tool.href}
                  className="toolButton"
                >
                  Use Tool →
                </Link>

              ) : (

                <span className="toolButton comingSoon">
                  Coming Soon
                </span>

              )}

            </div>

          ))}

        </div>

      </section>

      <section className="features">

        <div>
          <strong>100%</strong>
          <span>Free to Use</span>
        </div>

        <div>
          <strong>⚡ Fast</strong>
          <span>Processing</span>
        </div>

        <div>
          <strong>🛡️ Secure</strong>
          <span>Your files stay on your device</span>
        </div>

        <div>
          <strong>📱 All Devices</strong>
          <span>Mobile & Desktop</span>
        </div>

      </section>

      <section className="why" id="about">

        <div className="sectionTitle">

          <h2>Why Choose KaamKit?</h2>

          <p>
            Simple tools for everyday work.
          </p>

        </div>

        <div className="whyGrid">

          <div>
            <div className="roundIcon">⚡</div>
            <h3>Super Fast</h3>
            <p>Get results in seconds.</p>
          </div>

          <div>
            <div className="roundIcon">🛡️</div>
            <h3>Privacy First</h3>
            <p>Your files stay on your device.</p>
          </div>

          <div>
            <div className="roundIcon">₹</div>
            <h3>Always Free</h3>
            <p>No hidden charges.</p>
          </div>

          <div>
            <div className="roundIcon">📱</div>
            <h3>All Devices</h3>
            <p>Works on mobile, tablet and desktop.</p>
          </div>

        </div>

      </section>

      <section className="cta">

        <div>
          <h2>Ready to Make Your Work Easier?</h2>

          <p>
            Try KaamKit free tools today.
          </p>
        </div>

        <Link href="/#tools">
          Explore Tools →
        </Link>

      </section>

      <footer id="contact">

        <div className="footerBrand">

          <Link href="/" className="logo">

            <div className="logoIcon">K</div>

            <span>
              Kaam<span>Kit</span>
            </span>

          </Link>

          <p>Simple Tools. Better Work.</p>

          <p>
            Free online tools for students,
            professionals and everyone.
          </p>

        </div>

        <div>

          <h3>Quick Links</h3>

          <Link href="/">Home</Link>
          <Link href="/#tools">Tools</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>

        </div>

        <div>

          <h3>Popular Tools</h3>

          <Link href="/#jpg-pdf">JPG to PDF</Link>
          <Link href="/compressor">Image Compressor</Link>
          <Link href="/resizer">Image Resizer</Link>
          <Link href="/#tools">PDF Tools</Link>
          <Link href="/#tools">GST Calculator</Link>
          <Link href="/#tools">QR Generator</Link>

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
