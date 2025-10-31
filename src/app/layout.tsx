import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import CustomCursor from "@/components/custom-cursor";
import ScrollProgress from "@/components/scroll-progress";
import Footer from "@/components/footer";
import DevToolsFixProvider from "@/components/devtools-fix-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mahammad Aftab",
    template: "%s | Portfolio"
  },
  description: "Professional portfolio showcasing skills, projects, and experience",
  keywords: ["portfolio", "developer", "frontend", "react", "nextjs", "typescript"],
  authors: [{ name: "Mahammad Aftab" }], // TODO: Replace with your name
  creator: "Mahammad Aftab", // TODO: Replace with your name
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mahammadaftab.vercel.app/", // TODO: Replace with your domain
    title: "Portfolio | Mahammad Aftab",
    description: "Professional portfolio showcasing skills, projects, and experience",
    images: [
      {
        url: "https://mahammadaftab.vercel.app/og-image.jpg", // TODO: Replace with your OG image
        width: 1200,
        height: 630,
        alt: "Portfolio Website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Mahammad Aftab",
    description: "Professional portfolio showcasing skills, projects, and experience",
    images: ["https://mahammadaftab.vercel.app/og-image.jpg"], // TODO: Replace with your OG image
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://mahammadaftab.vercel.app/", // TODO: Replace with your domain
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-900 dark:text-white relative`}
      >
        <DevToolsFixProvider>
          <ThemeProvider>
            <ScrollProgress />
            <CustomCursor />
            <Navbar />
            <main className="min-h-screen pt-16 relative">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </DevToolsFixProvider>
      </body>
    </html>
  );
}