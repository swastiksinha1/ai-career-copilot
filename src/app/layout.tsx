// src/app/layout.tsx

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | AI Career Copilot",
    default: "AI Career Copilot - Your Placement OS",
  },
  description: "End-to-end AI-powered placement OS to optimize your resume, GitHub, and interview skills.",
  openGraph: {
    title: "AI Career Copilot",
    description: "End-to-end AI-powered placement OS to optimize your resume, GitHub, and interview skills.",
    siteName: "AI Career Copilot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Career Copilot",
    description: "End-to-end AI-powered placement OS.",
  }
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
