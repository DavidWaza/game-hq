"use client";
import Image from "next/image";
import React from "react";
import StatusIndicator from "./Status";
import { PencilSimpleLine } from "@phosphor-icons/react";
import GameStats from "./GameStats";
import ProfileEdit from "./ProfileEdit";
import Button from "@/app/components/Button";
import { useAuth } from "@/contexts/AuthContext";

const Banner = () => {
  const [reveal, setReveal] = React.useState(false);
  const { user } = useAuth();

  const handleReveal = () => {
    setReveal(true);
  };

  return (
    <div className="relative min-h-[300px]  text-white">
      {/* Banner Background */}
      <div className="profile-banner relative w-full border-y-0 border border-[#f37f2d] border-x-0 border-b">
        {/* Optional: Add a subtle overlay for depth */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Profile Avatar */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[30%] transition-transform hover:scale-105">
          <div className="relative rounded-full w-32 h-32 xl:h-52 xl:w-52 border-4 border-[#f37f2d] bg-[#1a0b2e] flex items-center justify-center shadow-lg shadow-[#f37f2d]/50">
            <Image
              src="/assets/basketball-av.svg"
              width={0}
              height={0}
              sizes="100vw"
              priority
              alt="Profile Avatar"
              className="w-full h-full object-contain object-center p-2"
            />
            {/* Optional: Rank Badge */}
            <span className="absolute -top-2 -right-2 bg-[#f37f2d] text-black text-xs font-bold rounded-full px-2 py-1">
              Gold
            </span>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center mt-24 px-4 md:px-20">
        {/* Left: Empty for balance or future widgets */}
        <div className="hidden md:block"></div>

        {/* Center: Username and Status */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-3">
            <StatusIndicator status="away" />
          </div>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white">
            David <span className="text-[#f37f2d] drop-shadow-md">Waza</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Pro Basketball Gamer | 250 Wins
          </p>
        </div>

        {/* Right: Edit Button */}
        <div className="flex justify-center md:justify-end mt-4 md:mt-0 w-full lg:w-1/2 ml-auto">
          {!reveal && (
            <div className="transRight">
              <Button
                className="active"
                variant="primary"
                size="sm"
                onClick={handleReveal}
              >
                <PencilSimpleLine size={25} />
                <span>Edit Profile</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      <div>
        {reveal ? (
          <div className="transIn flex justify-center items-center px-2">
            <ProfileEdit reveal={reveal} setReveal={setReveal} />
          </div>
        ) : (
          <GameStats />
        )}
      </div>
    </div>
  );
};

export default Banner;
