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

interface StatusCardProps {
  logo?: string;
  name: string;
  status?: string;
  prize: string;
  time: string;
  players: number;
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
  const settingsCategories = [
    {
      label: "View Details",
      action: () => {
        window.location.href = `/dashboard/join-tournament/${tournament.id}`;
      },
      icon: () => "🔗",
    },
    {
      label: "Join Now",
      action: () => {
        showModal(tournament);
      },
      icon: () => "➜",
    },
    {
      label: "Copy Link",
      action: () => {
        const url = `${window.location.origin}/dashboard/join-tournament/${tournament.id}`;
        copyToClipboard(url, "Tournament Link Copied!");
      },
      icon: () => "🔗",
    },
  ];

  const getTdClasses = (isFirst: boolean = false, isLast: boolean = false) => {
    let classes = "block md:table-cell w-full md:w-auto";
    classes += " px-4 py-3";
    classes += " md:py-4";

    if (isFirst) {
      classes += " md:pl-4 md:pr-2";
    } else if (isLast) {
       // Use slightly more padding for the last cell (actions) on desktop
      classes += " md:px-4 md:pr-4";
    } else {
       // Keep original compact padding for middle cells on desktop
      classes += " md:px-2";
    }

    if (!isFirst) {
      classes += " border-t border-gray-800 md:border-t-0";
    }

    return classes;
  };

  return (
    <tr
      onClick={() => showModal(tournament)}
      className="transLeft block md:table-row bg-[#0F1218] shadow-lg cursor-pointer hover:bg-[#161b24] transition-colors mb-4 md:mb-0 rounded-2xl md:rounded-none"
    >
      <td className={`${getTdClasses(true, false)} md:rounded-tl-2xl md:rounded-bl-2xl`}>
        <div className="flex gap-3 items-center text-white w-full">
          {logo && (
            <Image
              src={logo}
              alt={name}
              width={60}
              height={60}
              className="w-10 h-10 flex-shrink-0"
            />
          )}
          <span className="elipsis text-sm md:text-base font-semibold text-left flex-grow text-[#FCF8DB]">
            {name}
          </span>
        </div>
      </td>

      <td className={getTdClasses()}>
         <div className="flex justify-between items-center md:block md:text-left">
           <h4 className="text-gray-400 text-xs md:text-sm font-medium uppercase">
             Players
           </h4>
           <div className="text-right md:text-left">
             {status && (
               <p className="text-[#FCF8DB] text-xs font-semibold md:hidden">● {status.toUpperCase()}</p>
             )}
             <p className="text-[#FCF8DB] text-sm md:text-base font-semibold mt-0.5">
               {formatNumber(players)}
               {status && (
                 <span className="hidden md:inline text-xs font-semibold ml-1">● {status.toUpperCase()}</span>
               )}
             </p>
           </div>
         </div>
      </td>

      <td className={getTdClasses()}>
        <div className="flex justify-between items-center md:block md:text-left">
          <h4 className="text-gray-400 text-sm font-medium md:font-normal md:mb-0.5">PRIZE</h4>
          <p className="text-[#FCF8DB] text-sm md:text-base font-semibold">
            {formatCurrency(prize)}
          </p>
        </div>
      </td>

      <td className={getTdClasses()}>
        <div className="flex justify-between items-center md:block md:text-left">
          <h4 className="text-gray-400 text-sm font-medium md:font-normal md:mb-0.5">ODDS</h4>
          <p className="text-[#FCF8DB] text-sm md:text-base font-semibold">
            {odds.totalOdds.toFixed(2)}
          </p>
        </div>
      </td>

      <td className={getTdClasses()}>
         <div className="flex justify-between items-center md:block md:text-left">
           <h4 className="text-gray-400 text-sm font-medium md:font-normal md:mb-0.5">TIME</h4>
           <p className="flex items-center justify-end md:justify-start gap-1 text-[#FCF8DB] text-sm md:text-base font-semibold">
             <Clock size={18} className="md:size-5"/> {time}
           </p>
         </div>
      </td>

      <td className={`${getTdClasses(false, true)} md:rounded-tr-2xl md:rounded-br-2xl`}>
        <div className="w-full flex justify-center items-center h-full">
          <DropDown
            header={
              <div className="bg-black w-full md:w-auto px-4 py-2 rounded-md text-white text-xs font-bold flex items-center justify-center gap-1 mt-2 md:mt-0 cursor-pointer">
                <svg
                  fill="#fff"
                  height="20px"
                  width="20px"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8,6.5A1.5,1.5,0,1,1,6.5,8,1.5,1.5,0,0,1,8,6.5ZM.5,8A1.5,1.5,0,1,0,2,6.5,1.5,1.5,0,0,0,.5,8Zm12,0A1.5,1.5,0,1,0,14,6.5,1.5,1.5,0,0,0,12.5,8Z"></path>
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
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row onClick when clicking dropdown item
                        category.action();
                      }}
                      className="group px-4 py-2 flex items-center hover:bg-[#f37f2d] transition-all duration-200 cursor-pointer w-full text-left"
                    >
                      <span className="mr-3 text-lg">{<Icon />}</span>
                      <span className="text-[#fcf8db] group-hover:translate-x-1 transition-transform duration-200 text-sm">
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