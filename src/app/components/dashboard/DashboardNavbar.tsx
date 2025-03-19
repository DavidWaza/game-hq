"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BellSimple, Headset, MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardNavbar = () => {
  return (
    <div className="bg-white border-b border-[#CBD5E1] py-5 px-5 w-full sticky top-0 z-50 shadow-sm">
      <nav className="flex justify-between items-center gap-5">
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-white px-3 rounded-md md:w-[30%] border border-[#CBD5E1]">
          <MagnifyingGlass size={20} className="text-gray-500" />
          <Input
            type="text"
            placeholder="Search games, events"
            className="bg-transparent outline-none border-none focus:ring-0 focus:outline-none w-full"
          />
        </div>

        {/* Right Side: Notification, Support, Wallet */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-10 h-10 flex items-center justify-center">
                <BellSimple size={22} className="text-gray-400 hover:text-blue-700" />
              </TooltipTrigger>
              <TooltipContent>Notification</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Support */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-10 h-10 flex items-center justify-center">
                <Headset size={22} className="text-gray-400 hover:text-blue-700" />
              </TooltipTrigger>
              <TooltipContent>Support</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Wallet */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition-all">
                {/* Wallet Balance */}
                <div className="rounded-lg bg-white border border-gray-200 px-4 py-2 text-lg font-semibold text-gray-700 min-w-[100px] text-center">
                  ₦20,000
                </div>

                {/* Avatar */}
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/assets/default-av.jpg" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent className="text-sm text-gray-600">User Wallet</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </nav>
    </div>
  );
};

export default DashboardNavbar;
