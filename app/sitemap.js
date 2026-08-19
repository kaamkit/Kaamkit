export default function sitemap() {
  const baseUrl = "https://kaamkit-tools.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/jpg-to-pdf`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/image-compressor`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/image-resizer`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/gst-calculator`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/qr-generator`,
      lastModified: new Date(),
    },
  ];
}
