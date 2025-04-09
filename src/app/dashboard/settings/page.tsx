"use client";
import React from "react";
import { usePathname } from "next/navigation";

const SettingsPage = () => {
  const pathname = usePathname();
  const personalAccountPath = "/dashboard/settings/personal-account";
  return (
    <div>{pathname.includes(personalAccountPath)}</div>
  );
};

export default SettingsPage;
