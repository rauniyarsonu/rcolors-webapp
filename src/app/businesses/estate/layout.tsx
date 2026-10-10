import { Manrope } from "next/font/google";

// Heading face for the estate routes only, so other pages don't download it
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export default function EstateLayout({ children }: { children: React.ReactNode }) {
  // Root layout already provides <main>; this wrapper scopes the es tokens and font
  return <div className={`es ${manrope.variable} text-es-body`}>{children}</div>;
}
