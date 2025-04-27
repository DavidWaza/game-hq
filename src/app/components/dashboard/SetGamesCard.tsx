import React, { useState } from "react";
import Image from "next/image";
import { Clock } from "@phosphor-icons/react";
import Modal from "./Modal";
import { formatNumber } from "@/lib/utils";


interface StatusCardProps {
  logo?: string;
  name: string;
  odds?: string;
  status?: string;
  prize: string;
  time: string;
  borderColor?: string;
  players: number; 
}

const StatusCard: React.FC<StatusCardProps> = ({
  logo,
  name,
  status,
  prize,
  odds,
  time,
  borderColor,
  players,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate odds based on number of players
  const calculateOdds = () => {
    const availablePool = Number(prize) * 0.9;
    const oddsDetails = {
      first: { percentage: 0, odds: 0, amount: 0 },
      second: { percentage: 0, odds: 0, amount: 0 },
      third: { percentage: 0, odds: 0, amount: 0 },
      totalOdds: 0,
    };

    if (players === 2) {
      oddsDetails.first = { percentage: 100, odds: 1.8, amount: availablePool };
      oddsDetails.totalOdds = 1.8;
    } else if (players === 3) {
      oddsDetails.first = { percentage: 100, odds: 2.7, amount: availablePool };
      oddsDetails.totalOdds = 2.7;
    } else if (players === 4) {
      oddsDetails.first = {
        percentage: 75,
        odds: 2.7,
        amount: availablePool * 0.75,
      };
      oddsDetails.second = {
        percentage: 25,
        odds: 0.9,
        amount: availablePool * 0.25,
      };
      oddsDetails.totalOdds = 2.7 + 0.9;
    } else if (players >= 5 && players <= 10) {
      // Linear scaling for odds
      const t = (players - 5) / 5;
      const oddsFirst = 2.7 + t * (5.4 - 2.7);
      const oddsSecond = 1.35 + t * (2.7 - 1.35);
      const oddsThird = 0.45 + t * (0.9 - 0.45);

      oddsDetails.first = {
        percentage: 60,
        odds: oddsFirst,
        amount: availablePool * 0.6,
      };
      oddsDetails.second = {
        percentage: 30,
        odds: oddsSecond,
        amount: availablePool * 0.3,
      };
      oddsDetails.third = {
        percentage: 10,
        odds: oddsThird,
        amount: availablePool * 0.1,
      };
      oddsDetails.totalOdds = oddsFirst + oddsSecond + oddsThird;
    }

    return oddsDetails;
  };

  const Odds = calculateOdds();

  return (
    <>
      <div
        className="transLeft bg-[#0F1218] p-5 rounded-xl flex flex-col md:flex-row items-center gap-5 w-full max-w-3xl relative shadow-lg cursor-pointer hover:bg-[#161b24] transition-colors z-auto"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Left Section with Logo */}
        <div className="flex flex-col items-center text-white">
          {logo && (
            <Image
              src={logo}
              alt={name}
              width={60}
              height={60}
              className="w-10 h-10"
            />
          )}

          <span className="text-sm font-semibold text-center">{name}</span>
        </div>

        {/* Status Indicator */}
        <div
          className={`absolute top-0 left-0 h-2 w-20 rounded-tl-xl ${borderColor}`}
        ></div>

        {/* Middle Section with Info */}
        <div className="flex-1 flex flex-col md:flex-row justify-between items-center text-white border-l border-gray-700 md:pl-5 w-full space-y-3 md:space-y-0">
          <div className="text-center md:text-left">
            <h4 className="text-gray-400 text-sm">{name.toUpperCase()}</h4>
            {status && (
              <p className="text-[#FCF8DB] text-xs">● {status.toUpperCase()}</p>
            )}
            <p className="text-[#FCF8DB] text-xs">
              Players: {formatNumber(players)}
            </p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-gray-400 text-sm">PRIZE</h4>
            <p className="text-[#FCF8DB] flex items-center justify-center md:justify-start gap-1">
              {prize}
            </p>
          </div>
          {odds && (
            <div className="text-center md:text-left">
              <h4 className="text-gray-400 text-sm">Odds</h4>
              <p className="text-[#FCF8DB] flex items-center justify-center md:justify-start gap-1">
                {Odds.totalOdds.toFixed(2)}
              </p>
            </div>
          )}

          <div className="text-center md:text-left">
            <h4 className="text-gray-400 text-sm">TIME</h4>
            <p className="flex items-center justify-center md:justify-start gap-1 text-[#FCF8DB]">
              <Clock size={20} /> {time}
            </p>
          </div>
        </div>

        {/* Join Now Button */}
        <button
          className="bg-black px-4 py-2 rounded-md text-white text-xs font-bold flex items-center gap-1 mt-3 md:mt-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          JOIN NOW ➜
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        header={`${name.toUpperCase()} GAME RULES`}
        sub={`Prize Pool: ₦${prize} • Start Time: ${time} • Players: ${players} • Total Odds: ${Odds.totalOdds.toFixed(
          2
        )}×`}
        firstButtonText="Accept & Join"
        secondButtonText="Decline"
        onClick={() => {
          console.log(`Joining ${name} tournament`);
          setIsModalOpen(false);
        }}
        onTab={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default StatusCard;
