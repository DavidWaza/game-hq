import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
// import { FaYoutube, FaTwitch } from "react-icons/fa";

interface MatchCardProps {
  team1: string;
  team2: string;
  logo1: string | StaticImport;
  logo2: string | StaticImport;
  status: string;
  score: string;
  date: string;
  time: string;
}
const MatchCard: React.FC<MatchCardProps> = ({
  team1,
  team2,
  logo1,
  logo2,
  status,
  score,
  date,
  time,
}) => {
  return (
    <motion.div
      className="bg-[#0F1218] border border-[#4CAF50] rounded-xl p-5 flex items-center gap-5 w-full max-w-3xl"
      style={{ borderImage: "linear-gradient(to right, #FCF8DB, #233D4D) 1" }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Team Logos and VS */}
      <div className="lg:flex items-center gap-5 flex-1">
        <Image
          src={logo1}
          alt={team1}
          width={80}
          height={80}
          className="lg:w-20 lg:h-20 w-16"
        />
        <span className="text-white text-2xl font-bold">VS</span>
        <Image
          src={logo2}
          alt={team2}
          width={80}
          height={80}
          className="lg:w-20 lg:h-20 w-16"
        />
      </div>

      {/* Match Info */}
      <div
        className="border-l border-[#4CAF50] pl-5 flex flex-col flex-1 space-y-3"
        style={{ borderImage: "linear-gradient(to right, #FCF8DB, #233D4D) 1" }}
      >
        <div className="flex items-center gap-3">
          <span className="bg-[#233D4D] text-[#FCF8DB] px-3 py-1 rounded-md text-sm font-bold">
            {status}
          </span>
          <span className="border border-[#FCF8DB] px-3 py-1 text-[#FCF8DB] rounded-md text-sm font-bold">
            {score}
          </span>
        </div>
        <h3 className="text-white lg:text-xl font-semibold mt-2">
          {team1} VS {team2}
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          {date} <span className="text-[#FCF8DB]">{time}</span>
        </p>

        {/* Streaming Links */}
        <div className="flex items-center gap-3 mt-2">
          {/* <FaYoutube className="text-red-500 text-lg cursor-pointer" /> */}
          {/* <FaTwitch className="text-purple-500 text-lg cursor-pointer" /> */}
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;
