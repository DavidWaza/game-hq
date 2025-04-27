"use client";
import React from "react";
import Image from "next/image";
import { Clock } from "@phosphor-icons/react";
import {
  calculateTournamentOdds,
  copyToClipboard,
  formatCurrency,
  formatNumber,
} from "@/lib/utils";
import { TypeSingleTournament } from "../../../../types/global";
import DropDown from "@/components/DropDown";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface StatusCardProps {
  logo?: string;
  name: string;
  status?: string;
  prize: string;
  time: string;
  players: number; // New prop for number of players
  tournament: TypeSingleTournament;
  showModal?: (val: TypeSingleTournament) => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
  logo,
  name,
  status,
  players,
  prize,
  time,
  tournament,
  showModal = () => {},
}) => {
  const odds = calculateTournamentOdds(tournament);
  const { setState } = useAuth();
  const router = useRouter();
  const settingsCategories = [
    {
      label: "View Details",
      action: () => {
        setState(tournament, "singleTournament");
        router.push(`/dashboard/join-tournament/${tournament.id}`);
      },
      icon: () => {
        return "🔗";
      },
    },
    {
      label: "Join Now",
      action: () => {
        showModal(tournament);
      },
      icon: () => {
        return "➜";
      },
    },
    {
      label: "Copy Link",
      action: () => {
        const url = `${window.location.origin}/dashboard/join-tournament/${tournament.id}`;
        copyToClipboard(url, "Tournament Link Copied!");
      },
      icon: () => {
        return "🔗";
      },
    },
  ];
  // const selectedRules = getGameRules();
  // onClick={() => showModal(tournament)}
  return (
    <tr
      onClick={() => showModal(tournament)}
      className="transLeft bg-[#0F1218] shadow-lg cursor-pointer hover:bg-[#161b24] transition-colors z-auto"
    >
      {/* Left Section with Logo */}
      <td className="py-4 pl-4 pr-2 rounded-tl-2xl rounded-bl-2xl ">
        <div className="flex gap-2 items-center text-white">
          {logo && (
            <Image
              src={logo}
              alt={name}
              width={60}
              height={60}
              className="w-10 h-10"
            />
          )}

          <span className="elipsis text-sm font-semibold text-left">
            {name}
          </span>
        </div>
      </td>
      {/* Status Indicator */}
      {/* <div
          className={`absolute top-0 left-0 h-2 w-20 rounded-tl-2xl ${borderColor}`}
        ></div> */}
      {/* Middle Section with Info */}
      {/* <div className="flex-1 flex flex-col md:flex-row justify-between items-center text-white border-l border-gray-700 md:pl-5 w-full space-y-3 md:space-y-0"> */}
      <td className="py-4 pl-4 pr-2 border-l border-gray-700">
        <div className="text-center md:text-left">
          <h4 className="elipsis text-gray-400 text-sm">
            {"title(static)".toUpperCase()}
          </h4>
          {status && (
            <p className="text-[#FCF8DB] text-xs">● {status.toUpperCase()}</p>
          )}
          <p className="text-[#FCF8DB] flex items-center justify-center md:justify-start gap-1">
            Players: {formatNumber(players)}
          </p>
        </div>
      </td>
      <td className="py-4 px-2">
        <div className="text-center md:text-left">
          <h4 className="text-gray-400 text-sm">PRIZE</h4>
          <p className="text-[#FCF8DB] flex items-center justify-center md:justify-start gap-1">
            {formatCurrency(prize)}
          </p>
        </div>
      </td>
      <td className="py-4 px-2">
        <div className="text-center md:text-left">
          <h4 className="text-gray-400 text-sm">ODDS</h4>
          <p className="text-[#FCF8DB] flex items-center justify-center md:justify-start gap-1">
            {odds.totalOdds.toFixed(2)}
          </p>
        </div>
      </td>
      <td className="py-4 px-2">
        <div className="text-center md:text-left">
          <h4 className="text-gray-400 text-sm">TIME</h4>
          <p className="flex items-center justify-center md:justify-start gap-1 text-[#FCF8DB]">
            <Clock size={20} /> {time}
          </p>
        </div>
      </td>
      {/* </div> */}
      {/* Join Now Button */}
      <td className="py-4 pr-4  rounded-tr-2xl rounded-br-2xl">
        <div className="w-full flex_center">
          <DropDown
            header={
              <div className="bg-black px-4 py-2 rounded-md text-white text-xs font-bold flex items-center gap-1 mt-3 md:mt-0">
                {/* onClick={(e) => {
              e.stopPropagation();
            }} */}
                <svg
                  fill="#fff"
                  height="20px"
                  width="20px"
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  stroke="#fff"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      className="cls-1"
                      d="M8,6.5A1.5,1.5,0,1,1,6.5,8,1.5,1.5,0,0,1,8,6.5ZM.5,8A1.5,1.5,0,1,0,2,6.5,1.5,1.5,0,0,0,.5,8Zm12,0A1.5,1.5,0,1,0,14,6.5,1.5,1.5,0,0,0,12.5,8Z"
                    ></path>
                  </g>
                </svg>
              </div>
            }
            toolTip="Action"
            content={
              <div className="w-full space-y-2">
                {settingsCategories.map((category, catIndex) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={catIndex + 232323}
                      onClick={() => {
                        category.action();
                      }}
                      className="group px-4 py-2 flex items-center hover:bg-[#f37f2d] transition-all duration-200 cursor-pointer w-full"
                    >
                      <span className="mr-3 text-lg">{<Icon />}</span>

                      <span className="text-[#fcf8db] group-hover:translate-x-1 transition-transform duration-200">
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            }
          />
        </div>
      </td>
    </tr>
  );
};

export default StatusCard;
