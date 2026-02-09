import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

const NAV_LINKS = [
  { title: "About", href: "/about" },
  { title: "Refer & Earn", href: "/refer-earn" },
  { title: "Pricing", href: "/pricing" },
  { title: "XYZ", href: "/xyz" },
];

export const LandingHeader = () => (
  <header
    className="  sticky top-0 z-50
  h-[10vh]
  bg-slate-900 backdrop-blur-md
  border-b border-white/5"
  >
    <div className="px-6 h-16 flex items-center justify-between">
      <Logo />
      <NavLinks />
      <AuthButtons />
    </div>
  </header>
);

const Logo = () => (
  <Link
    href="/"
    className="font-semibold text-lg text-white hover:opacity-80 transition-opacity"
  >
    Dmbroo
  </Link>
);

const NavLinks = () => (
  <nav className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
    {NAV_LINKS.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className="px-4 py-1.5 hover:text-white hover:bg-white/10 rounded-full transition-all"
      >
        <p className="text-white text-sm font-medium">{link.title}</p>
      </Link>
    ))}
  </nav>
);

const AuthButtons = () => (
  <div className="flex items-center gap-3 border border-gray-500 rounded-full p-1">
    <SignedOut>
      <Link
        href="/auth/signin"
        className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
      >
        Log in
      </Link>
      <Link
        href="/"
        className="px-5 py-2 text-sm font-medium text-white bg-[#6A06E4] hover:from-fuchsia-700 hover:to-purple-700 rounded-full transition-all shadow-lg shadow-fuchsia-500/25"
      >
        Start for free
      </Link>
    </SignedOut>
    <SignedIn>
      <Link
        href="/dashboard"
        className="px-5 py-2 text-sm font-medium text-white bg-[#6A06E4] hover:from-fuchsia-700 hover:to-purple-700 rounded-full transition-all shadow-lg shadow-fuchsia-500/25"
      >
        Dashboard
      </Link>
    </SignedIn>
  </div>
);
