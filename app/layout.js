import "./globals.css";

export const metadata = {
  title: "KaamKit - Free Online Tools",
  description:
    "KaamKit provides free, fast and secure online tools for everyday work.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
