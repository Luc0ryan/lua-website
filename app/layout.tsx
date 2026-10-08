import type { Metadata } from "next";
import { Archivo, Archivo_Narrow, DM_Sans } from "next/font/google";
import { getSiteSettings } from "@/sanity/lib/queries";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Footer wordmark only — see Footer.tsx.
const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: "Looking Up Arts",
  description: "Interactive art built to bring people together.",
  // Defaults for every page; project pages override with their own image.
  openGraph: {
    siteName: "Looking Up Arts",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { uppercaseTitles } = await getSiteSettings();

  return (
    <html lang="en" className={`${archivo.variable} ${dmSans.variable} ${archivoNarrow.variable}`}>
      <body
        data-titlecase={uppercaseTitles ? "upper" : "normal"}
        className="min-h-screen flex flex-col"
      >
        {children}
      </body>
    </html>
  );
}
