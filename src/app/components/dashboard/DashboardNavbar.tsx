"use client";
import React from "react";

import Link from "next/link";
import CodDogTag from "./UserProfileTag";

interface Navbar {
  bgColor?: string;
  color?: string;
}

const DashboardNavbar: React.FC<Navbar> = ({ bgColor, color }) => {

  return (
    <div
      className={`bg-transparent border-[#CBD5E1] py-5 px-5 w-full fixed top-0 z-50 ${bgColor}`}
    >
      <nav className="flex justify-between items-start gap-5">
        <div>
          <Link href="/dashboard">
            <p className={`text-4xl font-medium ${color}`}>GameHQ</p>
          </Link>
        </div>

        {/* Right Side: Wallet & Dropdown */}
        <CodDogTag />
      </nav>
    </div>
  );
};

export default DashboardNavbar;
