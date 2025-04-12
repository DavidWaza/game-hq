"use client";
import CreateWagerBanner from "@/app/components/dashboard/join-wager-banner";
import Navbar from "@/components/Navbar";
import TimeBanner from "@/app/components/dashboard/TimeBanner";
import React from "react";

const CreateWager = () => {
  return (
    <>
      <Navbar variant="primary" />
      <TimeBanner />
      <CreateWagerBanner />
    </>
  );
};

export default CreateWager;
