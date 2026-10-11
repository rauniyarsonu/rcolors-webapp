import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AosProvider from "@/components/AosProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

// Set NEXT_PUBLIC_SITE_URL to the production custom domain; the Netlify demo URL is the fallback.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rcolorgroup.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "R Colors Group of Companies | Construction, Finishing & Real Estate in Lucknow",
    template: "%s | R Colors Group",
  },
  description: "A trusted name in construction, contracting, and infrastructure development — delivering residential, commercial, and industrial projects with quality, precision, and commitment.",
  openGraph: {
    type: "website",
    siteName: "R Colors Group of Companies",
    title: "R Colors Group of Companies",
    description: "Construction, finishing works and real estate: residential, commercial and industrial projects delivered with quality and precision.",
    images: [{ url: "/images/home1.jpg", width: 1600, height: 900, alt: "R Colors Group of Companies" }],
  },
  twitter: { card: "summary_large_image" },
};

// Explicit viewport; viewport-fit=cover lets env(safe-area-inset-*) work on notched phones
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans antialiased bg-white text-[#1E1E1E] flex flex-col min-h-screen supports-[height:100dvh]:min-h-dvh`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-brand-navy focus:outline focus:outline-2 focus:outline-brand-navy"
        >
          Skip to content
        </a>
        <AosProvider>
          <Navbar />
          <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">
            {children}
          </main>
          <Footer />
        </AosProvider>
      </body>
    </html>
  );
}
