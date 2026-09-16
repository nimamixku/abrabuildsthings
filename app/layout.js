import "./globals.css";

export const metadata = {
  title: "Abra Builds Things",
  description:
    "Abra builds things.com — if you can imagine it, I can build it. Tell me what you want, I build it, it's yours.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
