import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSheet } from "@/components/cart/cart-sheet";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Hearth — Considered objects for everyday living",
    template: "%s — Hearth",
  },
  description:
    "A small collection of homeware — vessels, textiles, and light — made to be lived with. A demo storefront with a simulated checkout.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <div
            role="region"
            aria-label="Demo store notice"
            className="bg-secondary px-4 py-2"
          >
            <p className="text-center text-xs text-foreground/75">
              Demo store — checkout is simulated and no payment is taken.
            </p>
          </div>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartSheet />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
