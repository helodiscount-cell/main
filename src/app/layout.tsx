import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "InstaAuto - Instagram Automation Made Simple",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    // Configures Clerk with security settings for CSRF protection
    // SameSite cookies are handled by Clerk automatically
    // Additional CSRF validation is done in middleware
    >
      <html lang="en">
        <link rel="icon" href="/logo.jpg" type="image/jpg" />
        {/* Enables font smoothing */}
        <body className="antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {/* <EnsureUser /> */}
            {children}
            <Toaster />
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
