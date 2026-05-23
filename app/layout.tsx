import type { Metadata } from "next";
import { Alfa_Slab_One, Caveat, Inter } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import "./globals.css";

const display = Alfa_Slab_One({ variable: "--font-display", subsets: ["latin"], weight: ["400"] });
const chalk = Caveat({ variable: "--font-chalk", subsets: ["latin"], weight: ["400","600","700"] });
const body = Inter({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chubbies Deli — Sandwiches on Central Ave, Orange NJ",
  description: "Heroes, breakfast sandwiches, hot platters, and the deli stuff your day needs. 101 reviews · 4.2★. Central Ave, Orange NJ.",
  openGraph: { title: "Chubbies Deli · Orange NJ", description: "Sandwiches done right.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${chalk.variable} ${body.variable} antialiased`}>
      <body className="bg-tile text-charcoal min-h-screen">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
