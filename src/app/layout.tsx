import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/providers/theme";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";

import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DmBroo - Instagram Automation Made Simple",
  description:
    "Automate your Instagram engagement with smart comment replies and DMs. Built for creators and businesses to grow their audience effortlessly.",
  keywords: [
    "Instagram automation",
    "Instagram DM automation",
    "comment auto-reply",
    "Instagram marketing",
    "social media automation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={jakarta.variable}>
        <body className="font-sans antialiased">
          <NextTopLoader />

          <ThemeProvider
            attribute="class"
            forcedTheme="light"
            defaultTheme="light"
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
