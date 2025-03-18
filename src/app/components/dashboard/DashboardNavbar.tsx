"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BellSimple, Headset } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardNavbar = () => {
  return (
    <div className="bg-white border border-b border-t-0 border-x-0 border-[#CBD5E1] py-7 px-5 m-0">
      <nav className="flex justify-between  gap-10 items-center">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white px-3 rounded-md md:w-[30%] border border-[#CBD5E1]">
          <MagnifyingGlass size={20} className="text-gray-500" />
          <Input
            type="text"
            placeholder="Search games, events"
            className="bg-transparent outline-none border-none focus:ring-0 focus:outline-none w-full"
          />
        </div>

        {/* Notification & wallet */}
        <div className="flex items-center gap-2">
          <div className="group bg-white  w-10 h-10 flex items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <BellSimple
                    size={20}
                    className="text-gray-400 group-hover:text-blue-700"
                  />
                </TooltipTrigger>
                <TooltipContent>Notification</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className=" group bg-white  w-10 h-10 flex items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Headset
                    size={20}
                    className="text-gray-400 group-hover:text-blue-700"
                  />
                </TooltipTrigger>
                <TooltipContent>Support</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className=" group bg-white rounded-full border border-gray-500 w-10 h-10 flex items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar>
                    <AvatarImage src="/assets/default-av.jpg" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>User</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DashboardNavbar;
