import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumiere Eatery | Premium Artisan Meals",
  description: "Experience the art of cooking in Johannesburg. Premium meals, hearty burgers, and bespoke dining.",
  keywords: ["eatery", "johannesburg", "meals", "artisan", "burgers", "dining", "restaurant", "Lumiere Eatery"],
  openGraph: {
    title: "Lumiere Eatery | Premium Artisan Meals",
    description: "Experience the art of cooking in Johannesburg. Premium meals, hearty burgers, and bespoke dining.",
    url: "https://lumiereeatery.co.za",
    siteName: "Lumiere Eatery",
    images: [
      {
        url: "https://lumiereeatery.co.za/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lumiere Eatery - Johannesburg",
      },
    ],
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumiere Eatery | Artisan Meals in Jozi",
    description: "Experience the art of cooking in Johannesburg.",
    images: ["https://lumiereeatery.co.za/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${interFont.variable} antialiased min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
