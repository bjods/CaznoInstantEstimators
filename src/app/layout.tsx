import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Cazno - Instant Estimates That Convert | Home Service Calculator",
  description: "Give your customers instant, accurate quotes 24/7. Reduce sales time by 73% and increase conversions by 2.5x with embeddable estimation widgets for home service businesses.",
  keywords: "instant estimates, home service calculator, fence calculator, concrete estimator, landscaping quotes, contractor software",
  openGraph: {
    title: "Cazno - Instant Estimates That Convert",
    description: "Give your customers instant, accurate quotes 24/7. Increase conversions by 2.5x.",
    type: "website",
    url: "https://cazno.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
