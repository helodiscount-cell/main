"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { title: "About", href: "/about" },
  { title: "Refer & Earn", href: "/refer-earn" },
  { title: "Pricing", href: "/pricing" },
  { title: "XYZ", href: "/xyz" },
];

export const LandingHeader = () => {
  const [isHeroInView, setIsHeroInView] = useState(true);

  useEffect(() => {
    const heroSection = document.getElementById("hero-section");

    if (!heroSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroInView(entry.isIntersecting);
      },
      {
        threshold: 0.3, // Triggers when 30% of hero is visible
        rootMargin: "-80px 0px 0px 0px", // Accounts for header height
      },
    );

    observer.observe(heroSection);

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <nav
        className={`flex items-center gap-1 px-3 py-2 rounded-full border transition-all duration-500 shadow-lg ${
          isHeroInView
            ? "bg-white/90 text-black border-black/10 backdrop-blur-xl"
            : "bg-black/90 text-white border-white/10 backdrop-blur-xl"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-1.5 rounded-full transition-all text-sm font-medium ${
              isHeroInView ? "hover:bg-black/10" : "hover:bg-white/10"
            }`}
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </header>
  );
};

// const Logo = () => (
//   <Link
//     href="/"
//     className="font-semibold text-lg text-white hover:opacity-80 transition-opacity"
//   >
//     Dmbroo
//   </Link>
// );

// const AuthButtons = () => (
//   <div className="flex items-center gap-3 border-gray-500 rounded-full p-1">
//     <SignedOut>
//       <Link
//         href="/auth/signin"
//         className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
//       >
//         Log in
//       </Link>
//       <Link
//         href="/"
//         className="px-5 py-2 text-sm font-medium text-white bg-[#6A06E4] hover:from-fuchsia-700 hover:to-purple-700 rounded-full transition-all shadow-lg shadow-fuchsia-500/25"
//       >
//         Start for free
//       </Link>
//     </SignedOut>
//     <SignedIn>
//       <Link
//         href="/dashboard"
//         className="px-5 py-2 text-sm font-medium text-white bg-[#6A06E4] rounded-full transition-all"
//       >
//         Dashboard
//       </Link>
//     </SignedIn>
//   </div>
// );
