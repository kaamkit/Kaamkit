"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

const tools = [
  {
    name: "JPG to PDF",
    icon: "📄",
    description: "Convert JPG, JPEG or PNG images to PDF easily.",
    href: "#jpg-pdf",
    available: true,
  },
  {
    name: "Image Compressor",
    icon: "🗜️",
    description: "Reduce image size quickly without losing quality.",
    href: "/compressor",
    available: true,
  },
  {
    name: "Image Resizer",
    icon: "↗️",
    description: "Resize your images to any dimension.",
    href: "/resizer",
    available: true,
  },
  {
    name: "PDF to Word",
    icon: "📝",
    description: "Convert PDF documents into editable Word files.",
    href: "#tools",
    available: false,
  },
  {
    name: "PDF to Excel",
    icon: "📊",
    description: "Convert PDF tables into Excel files.",
    href: "#tools",
    available: false,
  },
  {
    name: "Word to Excel",
    icon: "📋",
    description: "Convert Word data into Excel format.",
    href: "#tools",
    available: false,
  },
  {
    name: "Word to PDF",
    icon: "📑",
    description: "Convert Word documents into PDF.",
    href: "#tools",
    available: false,
  },
  {
    name: "Excel to PDF",
    icon: "📈",
    description: "Convert Excel files into PDF.",
    href: "#tools",
    available: false,
  },
  {
    name: "GST Calculator",
    icon: "₹",
    description: "Calculate GST, tax and final amount.",
    href: "#tools",
    available: false,
  },
  {
    name: "QR Generator",
    icon: "▦",
    description: "Create QR codes for text and links.",
    href: "#tools",
    available: false,
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
        alert("PDF creation failed. Please try another image.");
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

      {/* NAVBAR */}

      <nav className="navbar">

        <a href="#home" className="logo">
          <div className="logoIcon">K</div>

          <span>
            Kaam<span>Kit</span>
          </span>
        </a>

        <button
          className="menuBtn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          ☰
        </button>

        <div className={`navLinks ${menuOpen ? "open" : ""}`}>
          <a href="#home">Home</a>
          <a href="#tools">Tools</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

      </nav>

      {/* HERO */}

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

      {/* JPG TO PDF */}

      <section
        className="converterSection"
        id="jpg-pdf"
      >

        <div className="sectionTitle">

          <h2>
            JPG to PDF Converter
          </h2>

          <p>
            Convert your JPG, JPEG or PNG image
            into a PDF instantly.
          </p>

        </div>

        <div className="converterCard">

          {!preview ? (

            <label className="uploadBox">

              <div className="uploadIcon">
                📤
              </div>

              <h3>
                Upload an Image
              </h3>

              <p>
                JPG, JPEG or PNG
              </p>

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

      {/* TOOLS */}

      <section
        className="toolsSection"
        id="tools"
      >

        <div className="sectionTitle">

          <h2>
            Our Tools
          </h2>

          <p>
            Choose a tool below and get your
            work done in seconds.
          </p>

        </div>

        <div className="toolGrid">

          {tools.map((tool) => (

            <div
              className="toolCard"
              key={tool.name}
            >

              <div className="toolIcon">
                {tool.icon}
              </div>

              <h3>
                {tool.name}
              </h3>

              <p>
                {tool.description}
              </p>

              {/* AVAILABLE TOOLS */}

              {tool.available === true && (
                <a
                  href={tool.href}
                  className="toolButton"
                >
                  Use Tool →
                </a>
              )}

              {/* COMING SOON TOOLS */}

              {tool.available === false && (
                <span className="toolButton comingSoon">
                  Coming Soon
                </span>
              )}

            </div>

          ))}

        </div>

      </section>

      {/* FEATURES */}

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

      {/* ABOUT */}

      <section
        className="why"
        id="about"
      >

        <div className="sectionTitle">

          <h2>
            Why Choose KaamKit?
          </h2>

          <p>
            Because your time and data matter.
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
            <p>Works on mobile, tablet & desktop.</p>
          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="cta">

        <div>

          <h2>
            Ready to Make Your Work Easier?
          </h2>

          <p>
            Try our free tools and save your time.
          </p>

        </div>

        <a href="#tools">
          Explore Tools →
        </a>

      </section>

      {/* FOOTER */}

      <footer id="contact">

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

          <p>
            Free online tools for students,
            professionals and everyone.
          </p>

        </div>

        <div>

          <h3>
            Quick Links
          </h3>

          <a href="#home">Home</a>
          <a href="#tools">Tools</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>

        </div>

        <div>

          <h3>
            Popular Tools
          </h3>

          <a href="#jpg-pdf">JPG to PDF</a>
          <a href="/compressor">Image Compressor</a>
          <a href="/resizer">Image Resizer</a>
          <a href="#tools">PDF Tools</a>
          <a href="#tools">GST Calculator</a>
          <a href="#tools">QR Generator</a>

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
