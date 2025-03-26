'use client'
import CreateWagerBanner from "@/app/components/dashboard/Create-wager-banner";
import DashboardNavbar from "@/app/components/dashboard/DashboardNavbar";
import TimeBanner from "@/app/components/dashboard/TimeBanner";
import React from "react";

const CreateWager = () => {
  return (
    <div className="bg-[#0B0E13]">
      <DashboardNavbar bgColor={"bg-[#f2f3f4]"} />
      <TimeBanner />
      <CreateWagerBanner />
    </div>
  );
};

export default CreateWager;
