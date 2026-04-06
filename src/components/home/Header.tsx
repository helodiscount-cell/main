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
        className={`flex items-center gap-1 px-3 py-2 rounded-full border transition-all duration-500   ${
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
