import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "./components/Footer";
import { LocalBusinessJsonLd } from "./components/LocalBusinessJsonLd";
import { Nav } from "./components/Nav";
import { site, siteUrl } from "./lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OSCOMP IT Solution | CCTV & Security Camera Installation",
    template: "%s | OSCOMP IT Solution"
  },
  description: site.description,
  icons: {
    icon: site.logo,
    apple: site.logo
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="/assets/bootstrap/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Inter:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&display=swap"
        />
        <link rel="stylesheet" href="/assets/fonts/material-icons.min.css" />
        <LocalBusinessJsonLd />
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
