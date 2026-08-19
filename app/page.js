"use client";

import Link from "next/link";

export default function Home() {
  const tools = [
    {
      name: "JPG to PDF",
      icon: "📄",
      description: "Convert JPG images into PDF files easily.",
      link: "/jpg-to-pdf",
    },
    {
      name: "Image Compressor",
      icon: "🗜️",
      description: "Reduce image size while maintaining good quality.",
      link: "/image-compressor",
    },
    {
      name: "Image Resizer",
      icon: "📐",
      description: "Resize images to your required dimensions.",
      link: "/image-resizer",
    },
    {
      name: "GST Calculator",
      icon: "🧮",
      description: "Calculate GST, CGST, SGST and total amount quickly.",
      link: "/gst-calculator",
    },
    {
      name: "QR Generator",
      icon: "🔲",
      description:
        "Generate QR codes for text, links and other information.",
      link: "/qr-generator",
    },
    {
      name: "PDF to Word",
      icon: "📄",
      description: "Convert PDF files into editable Word documents.",
      link: "/pdf-to-word",
    },
    {
      name: "PDF to Excel",
      icon: "📊",
      description: "Convert PDF files into Excel spreadsheets.",
      link: "/pdf-to-excel",
    },
    {
      name: "Word to Excel",
      icon: "📝",
      description: "Convert Word documents into Excel spreadsheets.",
      link: "/word-to-excel",
    },
  ];

  return (
    <main style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <Link href="/" style={styles.logo}>
          KaamKit
        </Link>

        <nav style={styles.nav}>
          <a href="#tools" style={styles.navLink}>
            Tools
          </a>

          <a href="#why" style={styles.navLink}>
            Why KaamKit?
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.badge}>⚡ Free • Fast • Simple</div>

        <h1 style={styles.heroTitle}>
          Powerful tools for
          <br />
          <span style={styles.highlight}>everyday work.</span>
        </h1>

        <p style={styles.heroText}>
          Convert, compress, resize, calculate and generate —
          <br />
          everything you need in one simple place.
        </p>

        <a href="#tools" style={styles.heroButton}>
          Explore Free Tools →
        </a>

        <div style={styles.trust}>
          <span>✓ 100% Free</span>
          <span>✓ No Registration</span>
          <span>✓ Easy to Use</span>
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" style={styles.toolsSection}>
        <div style={styles.sectionHeading}>
          <div style={styles.smallTitle}>OUR TOOLS</div>

          <h2 style={styles.sectionTitle}>Everything you need</h2>

          <p style={styles.sectionText}>
            Simple online tools designed to save your time.
          </p>
        </div>

        <div style={styles.grid}>
          {tools.map((tool) => (
            <div key={tool.name} style={styles.card}>
              <div style={styles.iconBox}>{tool.icon}</div>

              <h3 style={styles.cardTitle}>{tool.name}</h3>

              <p style={styles.cardText}>{tool.description}</p>

              <Link href={tool.link} style={styles.cardButton}>
                Open Tool →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* WHY KAAMKIT */}
      <section id="why" style={styles.whySection}>
        <div style={styles.smallTitle}>WHY KAAMKIT?</div>

        <h2 style={styles.sectionTitle}>
          Work smarter. Get things done.
        </h2>

        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>⚡</div>

            <h3 style={styles.featureTitle}>Fast</h3>

            <p style={styles.featureText}>
              Get your work done quickly without complicated steps.
            </p>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>🔒</div>

            <h3 style={styles.featureTitle}>Privacy Friendly</h3>

            <p style={styles.featureText}>
              Your files are processed directly in your browser whenever
              possible.
            </p>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>💯</div>

            <h3 style={styles.featureTitle}>Free to Use</h3>

            <p style={styles.featureText}>
              Useful everyday tools without registration or unnecessary
              barriers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <div style={styles.ctaBadge}>🚀 MORE TOOLS COMING</div>

        <h2 style={styles.ctaTitle}>
          More useful tools are on the way.
        </h2>

        <p style={styles.ctaText}>
          KaamKit is growing to become your everyday online toolbox.
        </p>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div>
          <Link href="/" style={styles.footerLogo}>
            KaamKit
          </Link>

          <p style={styles.footerText}>
            Free online tools for everyday work.
          </p>
        </div>

        <div style={styles.footerRight}>
          © {new Date().getFullYear()} KaamKit
        </div>
      </footer>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #ffffff 45%, #f8fafc 100%)",
    color: "#111827",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  header: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "22px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "-1px",
    color: "#111827",
    textDecoration: "none",
  },

  nav: {
    display: "flex",
    gap: "26px",
    alignItems: "center",
  },

  navLink: {
    color: "#4b5563",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
  },

  hero: {
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "center",
    padding: "65px 24px 85px",
  },

  badge: {
    display: "inline-block",
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "9px 16px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "24px",
  },

  heroTitle: {
    fontSize: "clamp(48px, 8vw, 82px)",
    lineHeight: "1.02",
    letterSpacing: "-4px",
    margin: "0",
    fontWeight: "800",
  },

  highlight: {
    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  heroText: {
    fontSize: "20px",
    lineHeight: "1.6",
    color: "#6b7280",
    margin: "28px 0 34px",
  },

  heroButton: {
    display: "inline-block",
    background: "#111827",
    color: "#ffffff",
    padding: "16px 26px",
    borderRadius: "12px",
    textDecoration: "none",
    fontSize: "17px",
    fontWeight: "700",
    boxShadow: "0 12px 30px rgba(17, 24, 39, 0.18)",
  },

  trust: {
    marginTop: "28px",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "20px",
    color: "#6b7280",
    fontSize: "14px",
  },

  toolsSection: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "70px 24px",
  },

  sectionHeading: {
    textAlign: "center",
    marginBottom: "45px",
  },

  smallTitle: {
    color: "#4f46e5",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginBottom: "12px",
  },

  sectionTitle: {
    fontSize: "42px",
    lineHeight: "1.15",
    letterSpacing: "-1.5px",
    margin: "0 0 12px",
    fontWeight: "800",
  },

  sectionText: {
    color: "#6b7280",
    fontSize: "18px",
    lineHeight: "1.5",
    margin: "0",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "22px",
  },

  card: {
    background: "rgba(255, 255, 255, 0.95)",
    border: "1px solid #e5e7eb",
    borderRadius: "22px",
    padding: "30px",
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  },

  iconBox: {
    width: "62px",
    height: "62px",
    borderRadius: "17px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "31px",
    marginBottom: "22px",
  },

  cardTitle: {
    fontSize: "25px",
    lineHeight: "1.2",
    margin: "0 0 12px",
    fontWeight: "750",
  },

  cardText: {
    color: "#6b7280",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 25px",
  },

  cardButton: {
    marginTop: "auto",
    display: "block",
    textAlign: "center",
    background: "#111827",
    color: "#ffffff",
    padding: "13px 18px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "700",
  },

  whySection: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "90px 24px",
    textAlign: "center",
  },

  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "25px",
    marginTop: "45px",
  },

  feature: {
    padding: "25px",
  },

  featureIcon: {
    fontSize: "38px",
    marginBottom: "12px",
  },

  featureTitle: {
    fontSize: "21px",
    margin: "0 0 10px",
  },

  featureText: {
    color: "#6b7280",
    lineHeight: "1.6",
    margin: "0",
  },

  cta: {
    maxWidth: "1000px",
    margin: "30px auto 90px",
    padding: "65px 25px",
    textAlign: "center",
    borderRadius: "28px",
    background: "linear-gradient(135deg, #111827, #312e81)",
    color: "#ffffff",
  },

  ctaBadge: {
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "15px",
  },

  ctaTitle: {
    fontSize: "38px",
    lineHeight: "1.2",
    margin: "0 0 15px",
  },

  ctaText: {
    fontSize: "17px",
    lineHeight: "1.5",
    color: "#d1d5db",
    margin: "0",
  },

  footer: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "35px 24px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  footerLogo: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#111827",
    textDecoration: "none",
  },

  footerText: {
    color: "#6b7280",
    margin: "7px 0 0",
  },

  footerRight: {
    color: "#6b7280",
    fontSize: "14px",
  },
};
