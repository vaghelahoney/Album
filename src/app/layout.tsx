import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sarah & James - Wedding Album",
  description: "Our Digital Wedding Album",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sarah & James",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Disables zoom for app-like feel
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
