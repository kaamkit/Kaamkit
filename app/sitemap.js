const tools = [
  {
    name: "JPG to PDF",
    path: "/jpg-to-pdf",
  },
  {
    name: "Image Compressor",
    path: "/image-compressor",
  },
  {
    name: "Image Resizer",
    path: "/image-resizer",
  },
  {
    name: "GST Calculator",
    path: "/gst-calculator",
  },
  {
    name: "QR Generator",
    path: "/qr-generator",
  },
  {
    name: "PDF to Word",
    path: "/pdf-to-word",
  },
  {
    name: "PDF to Excel",
    path: "/pdf-to-excel",
  },
  {
    name: "Word to Excel",
    path: "/word-to-excel",
  },
];

export default function sitemap() {
  const baseUrl = "https://kaamkit-tools.vercel.app";

  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },

    ...tools.map((tool) => ({
      url: `${baseUrl}${tool.path}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
