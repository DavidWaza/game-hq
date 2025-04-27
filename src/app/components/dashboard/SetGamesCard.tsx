import React from "react";
import Image from "next/image";
import { Clock } from "@phosphor-icons/react";
import {
  calculateTournamentOdds,
  formatCurrency,
  formatNumber,
} from "@/lib/utils";
import { TypeSingleTournament } from "../../../../types/global";

// Existing interfaces for game rules remain unchanged
// interface GameRuleSet {
//   title: string;
//   rules: string[];
// }

// interface GameRulesCategory {
//   [gameName: string]: GameRuleSet;
// }

// interface GameRulesData {
//   [category: string]: GameRulesCategory;
// }

// Existing gameRules and defaultRules remain unchanged
// const gameRules: GameRulesData = {
// };

// const defaultRules: GameRuleSet = {
//   title: "Tournament Rules",
//   rules: [
//     "Registration – All players must register at least **30 minutes** before tournament start time.",
//     "Format – Single elimination bracket, matches as described in game-specific rules.",
//     "Disputes – Tournament organizers have final say in all rule interpretations and disputes.",
//     "Prizes – Top 3 places receive prizes according to tournament specifications.",
//     "Code of Conduct – Players must maintain respectful behavior throughout the tournament.",
//   ],
// };

interface StatusCardProps {
  logo?: string;
  name: string;
  status?: string;
  prize: string;
  time: string;
  borderColor?: string;
  players: number; // New prop for number of players
  tournament: TypeSingleTournament;
  showModal?: (val: TypeSingleTournament) => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
  logo,
  name,
  status,
  prize,
  time,
  borderColor,
  players,
  tournament,
  showModal = () => {},
}) => {
  const odds = calculateTournamentOdds(tournament);

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
          <button className="bg-black px-4 py-2 rounded-md text-white text-xs font-bold flex items-center gap-1 mt-3 md:mt-0">
            {/* onClick={(e) => {
              e.stopPropagation();
            }} */}
            JOIN ➜
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StatusCard;
