

export const metadata = {
  metadataBase: new URL("https://kaamkit-tools.vercel.app"),

  title: "KaamKit – Free Online PDF, Image & Document Tools",

  description:
    "KaamKit offers free online PDF, image and document tools including JPG to PDF, PDF to Word, PDF to Excel, Word to Excel, image compression, image resizing, GST calculator and QR generator.",

  keywords: [
    "KaamKit",
    "PDF tools",
    "PDF to Word",
    "PDF to Excel",
    "Word to Excel",
    "JPG to PDF",
    "Image Compressor",
    "Image Resizer",
    "GST Calculator",
    "QR Generator",
    "Free PDF tools",
    "Online document tools",
  ],

  authors: [{ name: "KaamKit" }],
  creator: "KaamKit",
  publisher: "KaamKit",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  verification: {
    google: "p72ltLP5q30xe0XmIdCUL2fjze1dqFd_Wvh8jqRC",
  },

  openGraph: {
    title: "KaamKit – Free Online PDF, Image & Document Tools",
    description:
      "Free online PDF, image and document tools from KaamKit.",
    url: "https://kaamkit-tools.vercel.app/",
    siteName: "KaamKit",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "KaamKit – Free Online PDF, Image & Document Tools",
    description:
      "Free online PDF, image and document tools from KaamKit.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
