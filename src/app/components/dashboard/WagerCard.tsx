import Link from "next/link";
import React from "react";

interface WagerCards {
  gameMode: string;
  gameCategory: string;
  gameTitle: string;
  gameDateSchedule: string;
  gameTime?: Date;
  gameUsers: number;
}

const WagerCard: React.FC<WagerCards> = ({
  gameMode,
  gameCategory,
  gameTitle,
  gameDateSchedule,
  //   gameTime,
  gameUsers,
}) => {
  return (
    <div>
      <Link href={"#"}>
        <div className="rounded-xl border border-[#1A5EFF] bg-[#E5EEFD] p-3 border-dotted hover:border-solid transition-all ease-in-out duration-300 space-y-1 xl:space-y-0 shadow-lg hover:shadow-sm">
          <div className="xl:flex justify-between items-center whitespace-nowrap">
            <div>
              {/* Wager category */}
              <p className="text-gray-400 font-normal py-2">{gameCategory}</p>
            </div>

            {/* Wager Mode */}
            <div
              className={`bg-[#E5EEFD] text-[#3F61E8] border border-[#1A5EFF] py-1 px-3 rounded-xl inline-flex ${
                gameMode === "Tournament" ? "bg-[#FDFBF3]" : ""
              }`}
            >
              {gameMode}
            </div>
          </div>

          {/* Wager title */}
          <div>
            <p className="text-xl font-semibold tracking-tight">{gameTitle}</p>
          </div>

          {/* Wager date */}
          <div className="py-1">
            <p className="text-sm font-normal tracking-tight">
              {gameDateSchedule}
            </p>
          </div>

          {/* no of participant && countdown-time */}
          <div className="xl:flex justify-between">
            <p className="text-sm font-normal tracking-tight whitespace-nowrap text-nowrap">
              {gameUsers} Participants
            </p>
            <div>Countdown timer</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default WagerCard;
