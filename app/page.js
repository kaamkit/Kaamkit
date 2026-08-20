"use client";

import Link from "next/link";
import { useState } from "react";

const tools = [
  {
    name: "JPG to PDF",
    icon: "📄",
    description: "Convert JPG, JPEG or PNG images to PDF files instantly.",
    href: "/jpg-to-pdf",
    active: true,
  },
  {
    name: "Image Compressor",
    icon: "🗜️",
    description: "Reduce image size quickly while keeping good quality.",
    href: "/compressor",
    active: true,
  },
  {
    name: "Image Resizer",
    icon: "↗️",
    description: "Resize your images to any custom dimensions.",
    href: "/resizer",
    active: true,
  },
  {
    name: "PDF to Word",
    icon: "📝",
    description: "Convert PDF documents into editable Word files.",
    href: "/pdf-to-word",
    active: true,
  },
  {
    name: "PDF to Excel",
    icon: "📊",
    description: "Convert PDF tables and data into Excel files.",
    href: "/pdf-to-excel",
    active: true,
  },
  {
    name: "Word to Excel",
    icon: "📋",
    description: "Convert Word document data into Excel format.",
    href: "/word-to-excel",
    active: true,
  },
  {
    name: "Word to PDF",
    icon: "📄",
    description: "Convert Word DOCX documents into PDF files.",
    href: "/word-to-pdf",
    active: true,
  },
  {
    name: "GST Calculator",
    icon: "₹",
    description: "Calculate GST, CGST, SGST and final amount instantly.",
    href: "/gst-calculator",
    active: true,
  },
  {
    name: "QR Generator",
    icon: "▦",
    description: "Create QR codes for text, links and useful information.",
    href: "/qr-generator",
    active: true,
  },
  {
    name: "Excel to PDF",
    icon: "📈",
    description: "Convert Excel spreadsheets into PDF files.",
    href: "#tools",
    active: true,
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredTools = tools.filter((tool) =>
    `${tool.name} ${tool.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="site">
      {/* NAVBAR */}
      <nav className="navbar">
        <Link href="/" className="logo" onClick={() => setMenuOpen(false)}>
          <div className="logoIcon">K</div>

          <span>
            Kaam<span className="logoBlue">Kit</span>
          </span>
        </Link>

        <button
          type="button"
          className="menuBtn"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className={`navLinks ${menuOpen ? "open" : ""}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>
            Home
          </a>

          <a href="#tools" onClick={() => setMenuOpen(false)}>
            Tools
          </a>

          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>

          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="heroContent">
          <div className="badge">⚡ Free • Fast • Secure</div>

          <h1>
            Your Everyday
            <br />
            <span>Work Toolkit</span>
          </h1>

          <p>
            Simple, powerful and free online tools
            <br className="desktopBreak" />
            to make your daily work easier.
          </p>

          <div className="searchBox">
            <span className="searchIcon">⌕</span>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tools... JPG to PDF, QR, GST"
              aria-label="Search tools"
            />

            <a href="#tools" className="searchButton">
              Search
            </a>
          </div>

          <div className="trust">
            <span>100% Free</span>
            <span>No Sign Up</span>
            <span>Works on All Devices</span>
          </div>
        </div>

        <div className="heroVisual">
          <div className="laptop">
            <div className="screen">
              <div className="screenLogo">K</div>
              <strong>KaamKit</strong>
              <small>Your Everyday Work Toolkit</small>
            </div>
            <div className="laptopBase"></div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="toolsSection" id="tools">
        <div className="sectionHeading">
          <div>
            <span className="sectionTag">OUR TOOLS</span>

            <h2>
              Tools that make
              <br />
              <span>work easier.</span>
            </h2>
          </div>

          <p>
            Everything you need for everyday
            <br />
            documents, images and calculations.
          </p>
        </div>

        {filteredTools.length === 0 ? (
          <div className="noResults">
            <div>🔎</div>
            <h3>No tool found</h3>
            <p>Try another search term.</p>
          </div>
        ) : (
          <div className="toolsGrid">
            {filteredTools.map((tool) => (
              <div className="toolCard" key={tool.name}>
                <div className="toolIcon">{tool.icon}</div>

                <h3>{tool.name}</h3>

                <p>{tool.description}</p>

                {tool.active ? (
                  <Link href={tool.href} className="toolButton">
                    Use Tool <span>→</span>
                  </Link>
                ) : (
                  <span className="toolButton comingSoon">
                    Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section className="aboutSection" id="about">
        <div className="aboutCard">
          <span className="sectionTag">ABOUT KAAMKIT</span>

          <h2>
            Simple tools.
            <br />
            <span>Real work.</span>
          </h2>

          <p>
            KaamKit is built to provide simple, fast and useful
            online tools for everyday work. No complicated
            software and no unnecessary sign-up.
          </p>

          <div className="aboutPoints">
            <div>
              <strong>⚡ Fast</strong>
              <span>Quick browser-based tools.</span>
            </div>

            <div>
              <strong>🔒 Secure</strong>
              <span>Designed with privacy in mind.</span>
            </div>

            <div>
              <strong>💙 Free</strong>
              <span>Useful tools without unnecessary barriers.</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contactSection" id="contact">
        <div className="contactCard">
          <span className="sectionTag">CONTACT</span>

          <h2>Have an idea for a tool?</h2>

          <p>
            KaamKit is continuously growing. More useful tools
            will be added over time.
          </p>

          <a
            href="mailto:contact@kaamkit.com"
            className="contactButton"
          >
            Contact KaamKit
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footerBrand">
          <div className="footerLogo">K</div>

          <div>
            <strong>
              Kaam<span>Kit</span>
            </strong>

            <p>Your Everyday Work Toolkit</p>
          </div>
        </div>

        <div className="footerLinks">
          <a href="#home">Home</a>
          <a href="#tools">Tools</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="copyright">
          © {new Date().getFullYear()} KaamKit. All rights reserved.
        </div>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        .site {
          min-height: 100vh;
          background: #f4f8ff;
          color: #14213d;
          font-family: Arial, Helvetica, sans-serif;
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          min-height: 78px;
          padding: 12px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.97);
          border-bottom: 1px solid #e3ebf5;
          backdrop-filter: blur(12px);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #14213d;
          text-decoration: none;
          font-size: 28px;
          font-weight: 800;
        }

        .logoIcon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1677ff;
          color: white;
          font-size: 27px;
          box-shadow: 0 8px 20px rgba(22, 119, 255, 0.2);
        }

        .logoBlue {
          color: #1677ff;
        }

        .navLinks {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .navLinks a {
          color: #4a5b73;
          text-decoration: none;
          font-size: 15px;
          font-weight: 700;
        }

        .navLinks a:hover {
          color: #1677ff;
        }

        .menuBtn {
          display: none;
          border: 0;
          background: #eef6ff;
          color: #14213d;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          font-size: 25px;
          cursor: pointer;
        }

        .hero {
          min-height: 570px;
          padding: 70px 7%;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 50px;
          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(22, 119, 255, 0.1),
              transparent 35%
            ),
            #f4f8ff;
        }

        .heroContent {
          max-width: 650px;
        }

        .badge {
          display: inline-block;
          padding: 9px 15px;
          border-radius: 30px;
          background: #e6f1ff;
          color: #1677ff;
          font-weight: 800;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(42px, 6vw, 70px);
          line-height: 1.02;
          letter-spacing: -2px;
        }

        .hero h1 span {
          color: #1677ff;
        }

        .hero p {
          margin: 22px 0 25px;
          color: #718096;
          font-size: 18px;
          line-height: 1.6;
        }

        .searchBox {
          width: 100%;
          max-width: 570px;
          min-height: 58px;
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #dce7f4;
          border-radius: 15px;
          padding: 6px;
          box-shadow: 0 12px 35px rgba(39, 78, 120, 0.08);
        }

        .searchIcon {
          padding: 0 10px;
          font-size: 24px;
          color: #718096;
        }

        .searchBox input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          font-size: 15px;
          color: #14213d;
        }

        .searchButton {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 90px;
          height: 46px;
          border-radius: 11px;
          background: #1677ff;
          color: white;
          text-decoration: none;
          font-weight: 800;
        }

        .trust {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 18px;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
        }

        .heroVisual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .laptop {
          width: min(440px, 100%);
          position: relative;
        }

        .screen {
          min-height: 280px;
          border: 9px solid #1b304d;
          border-radius: 18px;
          background: white;
          box-shadow: 0 20px 45px rgba(30, 60, 100, 0.18);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .screenLogo {
          width: 75px;
          height: 75px;
          border-radius: 20px;
          background: #e8f3ff;
          color: #1677ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 15px;
        }

        .screen strong {
          font-size: 25px;
        }

        .screen small {
          color: #718096;
          margin-top: 7px;
        }

        .laptopBase {
          height: 16px;
          width: 112%;
          margin-left: -6%;
          border-radius: 0 0 20px 20px;
          background: #b7c8db;
        }

        .toolsSection {
          padding: 80px 7%;
          background: white;
          scroll-margin-top: 70px;
        }

        .sectionHeading {
          max-width: 1150px;
          margin: 0 auto 40px;
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 30px;
        }

        .sectionTag {
          color: #1677ff;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .sectionHeading h2,
        .aboutCard h2 {
          margin: 10px 0 0;
          font-size: clamp(34px, 5vw, 52px);
          line-height: 1.05;
        }

        .sectionHeading h2 span,
        .aboutCard h2 span {
          color: #1677ff;
        }

        .sectionHeading p {
          color: #718096;
          line-height: 1.6;
          margin: 0;
        }

        .toolsGrid {
          max-width: 1150px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .toolCard {
          min-height: 330px;
          padding: 30px 25px;
          border: 1px solid #e0eaf5;
          border-radius: 23px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .toolCard:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 40px rgba(30, 80, 140, 0.12);
        }

        .toolIcon {
          width: 76px;
          height: 76px;
          border-radius: 21px;
          background: #edf6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 39px;
          margin-bottom: 18px;
        }

        .toolCard h3 {
          margin: 0 0 10px;
          font-size: 24px;
        }

        .toolCard p {
          min-height: 48px;
          margin: 0 0 25px;
          color: #718096;
          line-height: 1.5;
          font-size: 15px;
        }

        .toolButton {
          margin-top: auto;
          width: 100%;
          max-width: 220px;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 12px;
          background: #1677ff;
          color: white;
          text-decoration: none;
          font-weight: 800;
        }

        .toolButton:hover {
          background: #0866e8;
        }

        .comingSoon {
          background: #edf2f7;
          color: #718096;
        }

        .noResults {
          max-width: 600px;
          margin: 50px auto;
          text-align: center;
          padding: 50px;
          background: #f7faff;
          border-radius: 20px;
        }

        .noResults div {
          font-size: 45px;
        }

        .noResults h3 {
          font-size: 25px;
          margin: 12px 0;
        }

        .noResults p {
          color: #718096;
        }

        .aboutSection {
          padding: 80px 7%;
          background: #f4f8ff;
          scroll-margin-top: 70px;
        }

        .aboutCard {
          max-width: 1000px;
          margin: auto;
          background: white;
          padding: 55px;
          border-radius: 28px;
          border: 1px solid #e0eaf5;
        }

        .aboutCard p {
          max-width: 700px;
          color: #718096;
          font-size: 17px;
          line-height: 1.7;
          margin-top: 20px;
        }

        .aboutPoints {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 30px;
        }

        .aboutPoints div {
          padding: 20px;
          border-radius: 15px;
          background: #f5f9ff;
        }

        .aboutPoints strong,
        .aboutPoints span {
          display: block;
        }

        .aboutPoints span {
          color: #718096;
          font-size: 13px;
          margin-top: 7px;
          line-height: 1.4;
        }

        .contactSection {
          padding: 80px 7%;
          background: white;
          scroll-margin-top: 70px;
        }

        .contactCard {
          max-width: 850px;
          margin: auto;
          text-align: center;
          padding: 60px 25px;
          border-radius: 28px;
          background: #eaf4ff;
        }

        .contactCard h2 {
          margin: 12px 0;
          font-size: 38px;
        }

        .contactCard p {
          color: #718096;
          margin-bottom: 25px;
        }

        .contactButton {
          display: inline-flex;
          padding: 14px 25px;
          border-radius: 12px;
          background: #1677ff;
          color: white;
          text-decoration: none;
          font-weight: 800;
        }

        .footer {
          padding: 35px 7%;
          background: #101b2d;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          flex-wrap: wrap;
        }

        .footerBrand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footerLogo {
          width: 43px;
          height: 43px;
          border-radius: 12px;
          background: #1677ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 23px;
        }

        .footerBrand strong {
          font-size: 20px;
        }

        .footerBrand strong span {
          color: #54a0ff;
        }

        .footerBrand p {
          margin: 4px 0 0;
          color: #9aacbf;
          font-size: 12px;
        }

        .footerLinks {
          display: flex;
          gap: 20px;
        }

        .footerLinks a {
          color: #c8d4e3;
          text-decoration: none;
          font-size: 14px;
        }

        .copyright {
          color: #8293a8;
          font-size: 12px;
        }

        @media (max-width: 850px) {
          .menuBtn {
            display: block;
          }

          .navLinks {
            position: absolute;
            top: 78px;
            left: 0;
            right: 0;
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e3ebf5;
            display: none;
            flex-direction: column;
            align-items: stretch;
          }

          .navLinks.open {
            display: flex;
          }

          .navLinks a {
            padding: 13px;
            text-align: center;
          }

          .hero {
            grid-template-columns: 1fr;
            padding-top: 50px;
          }

          .heroVisual {
            order: -1;
          }

          .laptop {
            max-width: 350px;
          }

          .toolsGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sectionHeading {
            align-items: flex-start;
            flex-direction: column;
          }

          .aboutPoints {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .navbar {
            padding: 10px 18px;
          }

          .logo {
            font-size: 23px;
          }

          .logoIcon {
            width: 42px;
            height: 42px;
          }

          .hero {
            padding: 45px 18px 60px;
            text-align: center;
          }

          .hero p {
            font-size: 16px;
          }

          .desktopBreak {
            display: none;
          }

          .searchBox {
            min-height: 54px;
          }

          .searchButton {
            min-width: 75px;
            height: 42px;
          }

          .trust {
            justify-content: center;
            gap: 12px;
          }

          .toolsSection,
          .aboutSection,
          .contactSection {
            padding-left: 18px;
            padding-right: 18px;
          }

          .toolsGrid {
            grid-template-columns: 1fr;
          }

          .toolCard {
            min-height: 300px;
          }

          .aboutCard {
            padding: 30px 22px;
          }

          .contactCard h2 {
            font-size: 30px;
          }

          .footer {
            padding: 30px 18px;
            flex-direction: column;
            align-items: flex-start;
          }

          .footerLinks {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </main>
  );
}
