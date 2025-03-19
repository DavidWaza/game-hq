"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BellSimple, Headset, CaretDown } from "@phosphor-icons/react";
// import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="bg-transparent border-[#CBD5E1] py-5 px-5 w-full fixed top-0 z-50">
      <nav className="flex justify-between items-center gap-5">
        {/* Search Bar */}
        <div>
          {/* <Image
            src={
              "https://res.cloudinary.com/dgbl43ljm/image/upload/v1742387812/logo-short-white_vzer05.png"
            }
            alt="logo"
            width={0}
            height={0}
            sizes="100vw"
            className="w-20 h-auto object-cover object-center"
          /> */}
          <p className="text-white text-2xl font-medium">GameHQ</p>
        </div>

        {/* Right Side: Wallet & Dropdown */}
        <div className="relative flex gap-10">
          {/* Wallet & Avatar Button */}
          <button
            className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition-all"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {/* Wallet Balance */}
            <div className="rounded-lg bg-white border border-gray-200 px-4 py-2 text-lg font-semibold text-gray-700 min-w-[100px] text-center">
              ₦20,000
            </div>

            {/* Avatar */}
            <Avatar className="w-10 h-10">
              <AvatarImage src="/assets/default-av.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            {/* Dropdown Arrow (Only on Mobile) */}
            <CaretDown size={20} className="text-gray-500 block md:hidden" />
          </button>

          {/* Dropdown Menu (Only Visible on Mobile) */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 p-2 md:hidden">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                    <BellSimple size={22} className="text-gray-400" />
                    <span className="text-gray-700">Notifications</span>
                  </TooltipTrigger>
                  <TooltipContent>Notification</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                    <Headset size={22} className="text-gray-400" />
                    <span className="text-gray-700">Support</span>
                  </TooltipTrigger>
                  <TooltipContent>Support</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          <div className="hidden md:flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-10 h-10 flex items-center justify-center">
                  <BellSimple
                    size={22}
                    className="text-gray-400 hover:text-blue-700"
                  />
                </TooltipTrigger>
                <TooltipContent>Notification</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-10 h-10 flex items-center justify-center">
                  <Headset
                    size={22}
                    className="text-gray-400 hover:text-blue-700"
                  />
                </TooltipTrigger>
                <TooltipContent>Support</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Desktop View: Show Notifications & Support */}
      </nav>
    </div>
  );
};

export default DashboardNavbar;
