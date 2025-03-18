import { FacebookLogo } from "@phosphor-icons/react/dist/ssr/FacebookLogo";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr/InstagramLogo";
import { XLogo } from "@phosphor-icons/react/dist/ssr/XLogo";
import React from "react";

const Footer = () => {
  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-between h-20 py-5 bg-[#0F172A] relative bottom-0 text-white px-10">
      <div>&copy; {new Date().getFullYear()} GameHQ. All rights reserved.</div>
      <div>
        <p>
          Play Responsibly <span className="font-medium">18+</span>
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <FacebookLogo size={25} />
        <XLogo size={25} />
        <InstagramLogo size={25} />
      </div>
    </footer>
  );
};

export default Footer;
