"use client";
import { Warning, X } from "@phosphor-icons/react";
import React, { useState } from "react";

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const closeBanner = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="border border-[#D4AF37] rounded-lg bg-[#FDFBF3] mt-5 mx-3 md:mx-10 p-3">
      <div className="flex gap-5 justify-between items-center">
        <div className="md:inline-flex items-center gap-5 space-y-3 md:space-y-0">
          <div className="rounded-lg border border-[#D4AF37] p-2 inline-flex whitespace-nowrap">
            <Warning size={32} color="#D4AF37" />
          </div>
          <div>
            <p className="text-[#94A3B8] font-medium">
              You have a wager game starting in{" "}
              <span className="text-[#D4AF37]">24 mins.</span> Ensure you join
              before game starts to avoid forfeiture
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={closeBanner}
            className="cursor-pointer"
            aria-label="Close banner"
          >
            <X size={20} color="#94A3B8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
