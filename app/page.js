export default function Home() {
  const tools = [
    {
      name: "JPG to PDF",
      description: "Convert JPG images into PDF files easily.",
      icon: "📄",
      link: "/jpg-to-pdf",
      active: true,
    },
    {
      name: "Image Compressor",
      description: "Reduce image size while maintaining quality.",
      icon: "🗜️",
      link: "/image-compressor",
      active: true,
    },
    {
      name: "Image Resizer",
      description: "Resize images to your required dimensions.",
      icon: "📐",
      link: "/image-resizer",
      active: true,
    },
    {
      name: "GST Calculator",
      description: "Calculate GST amount quickly and easily.",
      icon: "🧮",
      link: "/gst-calculator",
      active: false,
    },
    {
      name: "QR Generator",
      description: "Generate QR codes quickly for your needs.",
      icon: "🔳",
      link: "/qr-generator",
      active: false,
    },
  ];

  return (
    <main style={styles.main}>
      <section style={styles.hero}>
        <div style={styles.logo}>KaamKit</div>

        <h1 style={styles.title}>Free Online Tools</h1>

        <p style={styles.subtitle}>
          Simple, fast and free tools for everyday work.
        </p>
      </section>

      <section style={styles.grid}>
        {tools.map((tool) => (
          <div key={tool.name} style={styles.card}>
            <div style={styles.icon}>{tool.icon}</div>

            <h2 style={styles.cardTitle}>{tool.name}</h2>

            <p style={styles.description}>{tool.description}</p>

            {tool.active ? (
              <a href={tool.link} style={styles.button}>
                Open Tool →
              </a>
            ) : (
              <button style={styles.comingSoon} disabled>
                Coming Soon
              </button>
            )}
          </div>
        ))}
      </section>

      <footer style={styles.footer}>
        <p>© 2026 KaamKit. Free online tools for everyone.</p>
      </footer>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    background: "#f7f8fa",
    color: "#111827",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
  },

  hero: {
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto 40px",
  },

  logo: {
    fontSize: "42px",
    fontWeight: "800",
    marginBottom: "15px",
  },

  title: {
    fontSize: "32px",
    margin: "0 0 12px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#6b7280",
    margin: 0,
  },

  grid: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
  },

  icon: {
    fontSize: "40px",
    marginBottom: "15px",
  },

  cardTitle: {
    fontSize: "22px",
    margin: "0 0 10px",
  },

  description: {
    color: "#6b7280",
    lineHeight: "1.5",
    minHeight: "48px",
  },

  button: {
    display: "inline-block",
    marginTop: "15px",
    padding: "12px 18px",
    background: "#111827",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: "600",
  },

  comingSoon: {
    marginTop: "15px",
    padding: "12px 18px",
    background: "#e5e7eb",
    color: "#6b7280",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
  },

  footer: {
    textAlign: "center",
    marginTop: "50px",
    color: "#9ca3af",
    fontSize: "14px",
  },
};
