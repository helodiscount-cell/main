import { LandingHeader } from "@/components/home/Header";
import HeroSection from "@/components/home/Hero";
import Section2 from "@/components/home/Section2";
import Testimony from "@/components/home/Testimony";

// Main landing page component
export default function LandingPage() {
  return (
    // Uses grid pattern background according to brand style
    <div className=" bg-[#FCF9FF] bg-[linear-gradient(to_right,rgba(106,6,228,0.18),transparent_20%,transparent_80%,rgba(106,6,228,0.18))]">
      <LandingHeader />
      <HeroSection />
      <Section2 />
      <Testimony />
      {/* <FAQ /> */}
    </div>
  );
}
