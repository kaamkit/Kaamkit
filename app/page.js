"use client";

import { useState } from "react";

const tools = [
  {
    name: "JPG to PDF",
    icon: "📄",
    description: "Convert your images to PDF easily.",
  },
  {
    name: "Image Compressor",
    icon: "🗜️",
    description: "Reduce image size without losing quality.",
  },
  {
    name: "Image Resizer",
    icon: "↗️",
    description: "Resize your images to any dimension.",
  },
  {
    name: "GST Calculator",
    icon: "₹",
    description: "Calculate GST, tax and final amount.",
  },
  {
    name: "QR Generator",
    icon: "▦",
    description: "Create QR codes for text and links.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="site">
      <nav className="navbar">
        <div className="logo">
          <div className="logoIcon">K</div>
          <span>Kaam<span>Kit</span></span>
        </div>

        <button
          className="menuBtn"
          onClick={() => setMenuOpen(!menuOpen)}
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

      <section className="hero" id="home">
        <div className="heroContent">
          <div className="badge">⚡ Free • Fast • Secure</div>

          <h1>
            Your Everyday
            <br />
            <span>Work Toolkit</span>
          </h1>

          <p>
            Simple, powerful and free online tools to make
            your daily work easier.
          </p>

          <div className="searchBox">
            <span>⌕</span>
            <input placeholder="Search tools... JPG to PDF, QR, GST" />
            <button>Search</button>
          </div>

          <div className="trust">
            <span>✓ 100% Free</span>
            <span>✓ No Sign Up</span>
            <span>✓ Works on All Devices</span>
          </div>
        </div>

        <div className="heroVisual">
          <div className="floatingCard card1">📄 PDF</div>
          <div className="floatingCard card2">🖼️ Image</div>
          <div className="floatingCard card3">₹ GST</div>

          <div className="laptop">
            <div className="screen">
              <div className="bigK">K</div>
              <strong>KaamKit</strong>
            </div>
            <div className="keyboard"></div>
          </div>
        </div>
      </section>

      <section className="toolsSection" id="tools">
        <div className="sectionTitle">
          <h2>Our Tools</h2>
          <p>Choose a tool below and get your work done in seconds.</p>
        </div>

        <div className="toolGrid">
          {tools.map((tool) => (
            <div className="toolCard" key={tool.name}>
              <div className="toolIcon">{tool.icon}</div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
              <button>Use Tool →</button>
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
          <p>Because your time and data matter.</p>
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

      <section className="cta">
        <div>
          <h2>Ready to Make Your Work Easier?</h2>
          <p>Try our free tools and save your time.</p>
        </div>
        <a href="#tools">Explore Tools →</a>
      </section>

      <footer id="contact">
        <div className="footerBrand">
          <div className="logo">
            <div className="logoIcon">K</div>
            <span>Kaam<span>Kit</span></span>
          </div>
          <p>Simple Tools. Better Work.</p>
          <p>Free online tools for students, professionals and everyone.</p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <a href="#home">Home</a>
          <a href="#tools">Tools</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <div>
          <h3>Popular Tools</h3>
          <a href="#tools">JPG to PDF</a>
          <a href="#tools">Image Compressor</a>
          <a href="#tools">Image Resizer</a>
          <a href="#tools">GST Calculator</a>
          <a href="#tools">QR Generator</a>
        </div>
      </footer>

      <div className="copyright">
        © 2026 KaamKit. All rights reserved.
        <span>Made with ❤️ in India 🇮🇳</span>
      </div>
    </main>
  );
}
