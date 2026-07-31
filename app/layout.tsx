import "@/styles/globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Woo Order management",
  description: "Manage WooCommerce orders with ease using our Next.js app. Assign orders to drivers, track deliveries, and handle driver payments — all from a single, efficient dashboard.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-primary`}
      >
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
