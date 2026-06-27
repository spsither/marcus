import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marcus Carter | Abstract Artist — East Village, NYC",
  description:
    "Based in New York City's East Village, Marcus Carter creates abstract paintings that explore life's essence through a vibrant palette, symbolic imagery, and elements drawn from four decades of experience with diagnostic imaging and various technologies.",
  keywords: [
    "Marcus Carter",
    "abstract art",
    "East Village",
    "New York artist",
    "contemporary painting",
    "NYC gallery",
    "abstract expressionism",
    "art for sale",
  ],
  authors: [{ name: "Marcus Carter" }],
  icons: {
    icon: "https://assets.squarespace.com/universal/default-favicon.ico",
  },
  openGraph: {
    title: "Marcus Carter | Abstract Artist",
    description:
      "Abstract paintings exploring life's essence through vibrant color and symbolic imagery. Based in NYC's East Village.",
    url: "https://marcuscarternyc.com",
    siteName: "Marcus Carter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcus Carter | Abstract Artist — East Village, NYC",
    description:
      "Abstract paintings exploring life's essence through vibrant color and symbolic imagery.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${dmSans.variable} antialiased`}
        style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}