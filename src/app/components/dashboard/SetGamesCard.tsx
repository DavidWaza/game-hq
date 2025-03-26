import React from "react";
import Image from "next/image";
import { Clock, Trophy } from "@phosphor-icons/react";

interface StatusCardProps {
  logo: string;
  name: string;
  status: string;
  prize: number;
  time: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  logo,
  name,
  status,
  prize,
  time,
}) => {
  return (
    <div className="bg-[#0F1218] p-5 rounded-xl flex flex-col md:flex-row items-center gap-5 w-full max-w-3xl relative shadow-lg">
      {/* Left Section with Logo */}
      <div className="flex flex-col items-center text-white">
        <Image
          src={logo}
          alt={name}
          width={60}
          height={60}
          className="w-16 h-16"
        />
        <span className="text-lg font-semibold text-center">{name}</span>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-0 left-0 bg-[#FCF8DB] h-2 w-20 rounded-tl-xl"></div>

      {/* Middle Section with Info */}
      <div className="flex-1 flex flex-col md:flex-row justify-between items-center text-white border-l border-gray-700 md:pl-5 w-full space-y-3 md:space-y-0">
        <div className="text-center md:text-left">
          <h4 className="text-gray-400 text-sm">{name.toUpperCase()}</h4>
          <p className="text-[#FCF8DB] text-xs">● {status.toUpperCase()}</p>
        </div>
        <div className="text-center md:text-left">
          <h4 className="text-gray-400 text-sm">PRIZE</h4>
          <p className="text-[#FCF8DB] flex items-center justify-center md:justify-start gap-1">
            <Trophy size={20} /> ₦{prize}
          </p>
        </div>
        <div className="text-center md:text-left">
          <h4 className="text-gray-400 text-sm">TIME</h4>
          <p className="flex items-center justify-center md:justify-start gap-1 text-[#FCF8DB]">
            <Clock size={20} /> {time}
          </p>
        </div>
      </div>

      {/* Live Now Button */}
      <button className="bg-black px-4 py-2 rounded-md text-white text-xs font-bold flex items-center gap-1 mt-3 md:mt-0">
        LIVE NOW ➜
      </button>
    </div>
  );
};

export default StatusCard;
