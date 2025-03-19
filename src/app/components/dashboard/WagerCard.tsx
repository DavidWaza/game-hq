"use client";
import {
  FlagPennant,
  PersonArmsSpread,
  SoccerBall,
  Timer,
} from "@phosphor-icons/react";
import React from "react";

interface WagerCards {
  gameMode: string;
  gameCategory: string;
  gameTitle: string;
  gameDateSchedule: string;
  gameUsers: number;
}

const WagerCard: React.FC<WagerCards> = ({
  gameMode,
  gameCategory,
  gameTitle,
  gameDateSchedule,
  gameUsers,
}) => {
  return (
    <div className="w-full max-w-[600px] sm:max-w-[700px] xl:max-w-[900px]">
      <div className="rounded-xl border border-[#1A5EFF] bg-[#E5EEFD] p-4 border-dotted hover:border-solid transition-all ease-in-out duration-300 space-y-1 shadow-lg hover:shadow-sm">
        
        {/* Header: Game Category & Mode */}
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-2">
            <FlagPennant size={16} weight="duotone" color="#bdc3c7" />
            <p className="text-gray-400 font-normal py-2 break-words">{gameCategory}</p>
          </div>

          <div
            className={`bg-[#E5EEFD] text-[#3F61E8] border border-[#1A5EFF] py-1 px-3 rounded-xl inline-flex text-sm sm:text-base ${
              gameMode === "Tournament" ? "bg-[#FDFBF3]" : ""
            }`}
          >
            {gameMode}
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <SoccerBall size={16} weight="duotone" color="#bdc3c7" />
          <p
            className={`font-semibold tracking-tight !text-left break-words ${
              gameTitle.length > 20 ? "text-lg md:text-lg font-bold" : "text-lg md:text-xl"
            }`}
          >
            {gameTitle}
          </p>
        </div>

        {/* Date */}
        <div className="py-1 flex items-center gap-2">
          <Timer size={16} weight="duotone" color="#bdc3c7" />
          <p className="text-base font-normal tracking-tight text-nowrap">
            {gameDateSchedule}
          </p>
        </div>

        {/* Participants & Countdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <PersonArmsSpread size={16} weight="duotone" color="#bdc3c7" />
            <p className="text-base font-normal tracking-tight">
              {gameUsers}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Timer size={16} weight="duotone" color="#bdc3c7" />
            <p className="text-base font-normal tracking-tight text-red-700 text-nowrap">
              5hrs to go
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WagerCard;
