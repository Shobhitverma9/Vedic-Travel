import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import Shell from "@/components/layout/Shell";
import { Toaster } from 'sonner';
import WhatsAppWidget from "@/components/WhatsAppWidget";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VedicTravel - Rediscovering Ancient Bharat",
  description: "India's #1 Cultural & Spiritual Tourism Company. Experience mesmerizing spiritual tours across ancient Bharat.",
  keywords: "spiritual tours, India tourism, cultural tours, temple tours, pilgrimage, Char Dham, Varanasi",
  icons: {
    icon: "/vt-icon.png?v=1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${dancingScript.variable}`}>
      <body className="antialiased">
        <QueryProvider>
          <Shell>
            {children}
          </Shell>
          <Toaster richColors position="top-center" />
          <WhatsAppWidget />
        </QueryProvider>
      </body>
    </html>
  );
}
