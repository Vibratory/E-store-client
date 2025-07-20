import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "../globals.css";
import Navbar from "@/components/Navbar";
import ToasterProvider from "@/lib/providers/ToasterProvider";
import { Open_Sans, Tsukimi_Rounded } from 'next/font/google';


const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap', // Ensures text remains visible during font loading
  variable: '--font-open-sans', // Optional: for CSS variables
});

// Configure Tsukimi Rounded
const tsukimiRounded = Tsukimi_Rounded({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'], // You can specify one or more weights
  variable: '--font-tsukimi-rounded', // Optional: for CSS variables
});

export const metadata: Metadata = {
  title: "Boutika Store",
  description: "Boutika Ecommerce Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} ${tsukimiRounded.variable}`}>
        <ClerkProvider>
          <ToasterProvider />
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
