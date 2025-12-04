import MainLogo from "./icon";
import React from "react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border/50 ">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MainLogo />
            <span className="font-bold text-lg">InstaAuto</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} InstaAuto. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
