"use client";

import Link from "next/link";
import { useState } from "react";

const tools = [
  {
    name: "JPG to PDF",
    icon: "📄",
    description: "Convert JPG, JPEG or PNG images to PDF easily.",
    href: "/jpg-to-pdf",
  },
  {
    name: "Image Compressor",
    icon: "🗜️",
    description: "Reduce image size quickly while keeping good quality.",
    href: "/compressor",
  },
  {
    name: "Image Resizer",
    icon: "↗️",
    description: "Resize your images to any custom dimensions.",
    href: "/resizer",
  },
  {
    name: "PDF to Word",
    icon: "📝",
    description: "Convert PDF documents into editable Word files.",
    href: "/pdf-to-word",
  },
  {
    name: "PDF to Excel",
    icon: "📊",
    description: "Convert PDF tables into Excel files.",
    href: "/pdf-to-excel",
  },
  {
    name: "Word to Excel",
    icon: "📋",
    description: "Convert Word document data into Excel files.",
    href: "/word-to-excel",
  },
  {
    name: "Word to PDF",
    icon: "📄",
    description: "Convert Word DOCX documents into PDF files.",
    href: "/word-to-pdf",
  },
  {
    name: "GST Calculator",
    icon: "₹",
    description: "Calculate GST, CGST, SGST and final amount instantly.",
    href: "/gst-calculator",
  },
  {
    name: "QR Generator",
    icon: "▦",
    description: "Create QR codes for text, links and websites.",
    href: "/qr-generator",
  },
  {
    name: "Excel to PDF",
    icon: "📈",
    description: "Convert Excel files into PDF documents.",
    href: "/excel-to-pdf",
  },
  {
    name: "PDF Merge",
    icon: "📑",
    description: "Merge multiple PDF files into one PDF document.",
    href: "/pdf-merge",
  },
  {
    name: "PDF Split",
    icon: "✂️",
    description: "Split PDF files and extract the pages you need.",
    href: "/pdf-split",
  },
  {
    name: "PDF Compressor",
    icon: "🗜️",
    description: "Reduce PDF file size quickly and easily.",
    href: "/pdf-compress",
  },
  {
    name: "OCR",
    icon: "🔎",
    description: "Extract editable text from images using OCR.",
    href: "/ocr",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredTools = tools.filter((tool) => {
    const searchText =
      `${tool.name} ${tool.description}`.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f8ff",
        color: "#14213d",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          minHeight: "78px",
          padding: "12px 6%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#ffffff",
          borderBottom: "1px solid #e3ebf5",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#14213d",
            textDecoration: "none",
            fontSize: "27px",
            fontWeight: "800",
          }}
        >
          <span
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "13px",
              background: "#1677ff",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
            }}
          >
            K
          </span>

          Kaam<span style={{ color: "#1677ff" }}>Kit</span>
        </Link>

        <div
          style={{
            display: "flex",
            gap: "30px",
            alignItems: "center",
          }}
        >
          <a href="#home" style={navLink}>
            Home
          </a>

          <a href="#tools" style={navLink}>
            Tools
          </a>

          <a href="#about" style={navLink}>
            About
          </a>

          <a href="#contact" style={navLink}>
            Contact
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section
        id="home"
        style={{
          minHeight: "520px",
          padding: "70px 7%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: "50px",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-block",
              padding: "9px 15px",
              borderRadius: "30px",
              background: "#e6f1ff",
              color: "#1677ff",
              fontWeight: "800",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            ⚡ Free • Fast • Secure
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(42px, 6vw, 68px)",
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            Your Everyday
            <br />
            <span style={{ color: "#1677ff" }}>
              Work Toolkit
            </span>
          </h1>

          <p
            style={{
              margin: "22px 0",
              color: "#718096",
              fontSize: "18px",
              lineHeight: 1.6,
            }}
          >
            Simple, powerful and free online tools
            to make your daily work easier.
          </p>

          <div
            style={{
              maxWidth: "580px",
              minHeight: "58px",
              display: "flex",
              alignItems: "center",
              background: "#ffffff",
              border: "1px solid #dce7f4",
              borderRadius: "15px",
              padding: "6px",
              boxShadow:
                "0 12px 35px rgba(39,78,120,.08)",
            }}
          >
            <span
              style={{
                padding: "0 10px",
                fontSize: "24px",
                color: "#718096",
              }}
            >
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools..."
              style={{
                flex: 1,
                minWidth: 0,
                border: 0,
                outline: 0,
                fontSize: "15px",
              }}
            />

            <a
              href="#tools"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "90px",
                height: "46px",
                borderRadius: "11px",
                background: "#1677ff",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "800",
              }}
            >
              Search
            </a>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "18px",
              marginTop: "18px",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            <span>✓ 100% Free</span>
            <span>✓ No Sign Up</span>
            <span>✓ All Devices</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "min(430px, 100%)",
              padding: "12px",
              borderRadius: "25px",
              background: "#1b304d",
              boxShadow:
                "0 25px 55px rgba(30,60,100,.18)",
            }}
          >
            <div
              style={{
                minHeight: "270px",
                borderRadius: "15px",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "75px",
                  height: "75px",
                  borderRadius: "20px",
                  background: "#e8f3ff",
                  color: "#1677ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                  fontWeight: "800",
                  marginBottom: "15px",
                }}
              >
                K
              </div>

              <strong style={{ fontSize: "25px" }}>
                KaamKit
              </strong>

              <span
                style={{
                  marginTop: "7px",
                  color: "#718096",
                }}
              >
                Your Everyday Work Toolkit
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section
        id="tools"
        style={{
          padding: "80px 7%",
          background: "#ffffff",
          scrollMarginTop: "80px",
        }}
      >
        <div
          style={{
            maxWidth: "1150px",
            margin: "0 auto 40px",
          }}
        >
          <span
            style={{
              color: "#1677ff",
              fontSize: "12px",
              fontWeight: "900",
              letterSpacing: "1.5px",
            }}
          >
            OUR TOOLS
          </span>

          <h2
            style={{
              margin: "10px 0 0",
              fontSize: "clamp(34px, 5vw, 52px)",
              lineHeight: 1.05,
            }}
          >
            Tools that make{" "}
            <span style={{ color: "#1677ff" }}>
              work easier.
            </span>
          </h2>

          <p
            style={{
              color: "#718096",
              marginTop: "15px",
            }}
          >
            Everything you need for everyday documents,
            images and calculations.
          </p>
        </div>

        <div
          style={{
            maxWidth: "1150px",
            margin: "auto",
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: "22px",
          }}
        >
          {filteredTools.map((tool) => (
            <div
              key={tool.name}
              style={{
                minHeight: "310px",
                padding: "28px 24px",
                border: "1px solid #e0eaf5",
                borderRadius: "23px",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                boxShadow:
                  "0 8px 25px rgba(30,80,140,.05)",
              }}
            >
              <div
                style={{
                  width: "74px",
                  height: "74px",
                  borderRadius: "20px",
                  background: "#edf6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "38px",
                  marginBottom: "17px",
                }}
              >
                {tool.icon}
              </div>

              <h3
                style={{
                  margin: "0 0 10px",
                  fontSize: "22px",
                }}
              >
                {tool.name}
              </h3>

              <p
                style={{
                  color: "#718096",
                  lineHeight: 1.5,
                  fontSize: "14px",
                  margin: "0 0 22px",
                }}
              >
                {tool.description}
              </p>

              <Link
                href={tool.href}
                style={{
                  marginTop: "auto",
                  width: "100%",
                  maxWidth: "220px",
                  minHeight: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  borderRadius: "12px",
                  background: "#1677ff",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: "800",
                }}
              >
                Use Tool →
              </Link>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "50px",
              color: "#718096",
            }}
          >
            🔎 No tool found.
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section
        id="about"
        style={{
          padding: "80px 7%",
          background: "#f4f8ff",
          scrollMarginTop: "80px",
        }}
      >
        <div
          style={{
            maxWidth: "950px",
            margin: "auto",
            background: "#ffffff",
            padding: "50px",
            borderRadius: "28px",
            border: "1px solid #e0eaf5",
          }}
        >
          <span
            style={{
              color: "#1677ff",
              fontSize: "12px",
              fontWeight: "900",
              letterSpacing: "1.5px",
            }}
          >
            ABOUT KAAMKIT
          </span>

          <h2
            style={{
              fontSize: "42px",
              margin: "12px 0",
            }}
          >
            Simple tools.
            <br />
            <span style={{ color: "#1677ff" }}>
              Real work.
            </span>
          </h2>

          <p
            style={{
              color: "#718096",
              fontSize: "17px",
              lineHeight: 1.7,
              maxWidth: "700px",
            }}
          >
            KaamKit provides simple, fast and useful
            online tools for everyday work without
            unnecessary complexity.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        style={{
          padding: "80px 7%",
          background: "#ffffff",
          scrollMarginTop: "80px",
        }}
      >
        <div
          style={{
            maxWidth: "850px",
            margin: "auto",
            textAlign: "center",
            padding: "55px 25px",
            borderRadius: "28px",
            background: "#eaf4ff",
          }}
        >
          <span
            style={{
              color: "#1677ff",
              fontSize: "12px",
              fontWeight: "900",
              letterSpacing: "1.5px",
            }}
          >
            CONTACT
          </span>

          <h2
            style={{
              fontSize: "36px",
              margin: "12px 0",
            }}
          >
            Have an idea for a tool?
          </h2>

          <p style={{ color: "#718096" }}>
            More useful tools will be added to KaamKit.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "35px 7%",
          background: "#101b2d",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <strong style={{ fontSize: "21px" }}>
            Kaam<span style={{ color: "#54a0ff" }}>Kit</span>
          </strong>

          <p
            style={{
              color: "#9aacbf",
              fontSize: "13px",
              margin: "5px 0 0",
            }}
          >
            Your Everyday Work Toolkit
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <a href="#home" style={footerLink}>
            Home
          </a>

          <a href="#tools" style={footerLink}>
            Tools
          </a>

          <a href="#about" style={footerLink}>
            About
          </a>

          <a href="#contact" style={footerLink}>
            Contact
          </a>
        </div>

        <span
          style={{
            color: "#8293a8",
            fontSize: "12px",
          }}
        >
          © {new Date().getFullYear()} KaamKit
        </span>
      </footer>
    </main>
  );
}

const navLink = {
  color: "#4a5b73",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: "700",
};

const footerLink = {
  color: "#c8d4e3",
  textDecoration: "none",
  fontSize: "14px",
};
