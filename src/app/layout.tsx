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
    default: "Portfolio | Professional Developer",
    template: "%s | Portfolio"
  },
  description: "Professional portfolio showcasing skills, projects, and experience",
  keywords: ["portfolio", "developer", "frontend", "react", "nextjs", "typescript"],
  authors: [{ name: "Your Name" }], // TODO: Replace with your name
  creator: "Your Name", // TODO: Replace with your name
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-portfolio-url.com", // TODO: Replace with your domain
    title: "Portfolio | Professional Developer",
    description: "Professional portfolio showcasing skills, projects, and experience",
    images: [
      {
        url: "https://your-portfolio-url.com/og-image.jpg", // TODO: Replace with your OG image
        width: 1200,
        height: 630,
        alt: "Portfolio Website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Professional Developer",
    description: "Professional portfolio showcasing skills, projects, and experience",
    images: ["https://your-portfolio-url.com/og-image.jpg"], // TODO: Replace with your OG image
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://your-portfolio-url.com", // TODO: Replace with your domain
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