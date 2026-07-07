import type { Metadata } from "next";
import { Archivo, DM_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Looking Up Arts",
  description: "Interactive art built to bring people together.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { uppercaseTitles } = await getSiteSettings();

  return (
    <html lang="en" className={`${archivo.variable} ${dmSans.variable}`}>
      <body
        data-titlecase={uppercaseTitles ? "upper" : "normal"}
        className="min-h-screen flex flex-col"
      >
        {children}
      </body>
    </html>
  );
}
