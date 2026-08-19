export const metadata = {
  title: "KaamKit - Free Online Tools",
  description: "Free online tools for everyday work.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="p72ltLP5q30xe0XmIdCUL2fjze1dqFd_Wvh8jqRCi8E"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
