import React, { useState } from "react";
import Image from "next/image";
import { Clock, Trophy } from "@phosphor-icons/react";
import Modal from "./Modal";

interface GameRuleSet {
  title: string;
  rules: string[];
}

interface GameRulesCategory {
  [gameName: string]: GameRuleSet;
}

interface GameRulesData {
  [category: string]: GameRulesCategory;
}

const gameRules:GameRulesData = {
  "Action Games": {
    "Call of Duty": {
      title: "Call of Duty Tournament Rules",
      rules: [
        "Game Mode & Map Selection – Matches will be played in **Search & Destroy** mode. Maps will be pre-selected by the tournament organizers.",
        "Team Size & Loadouts – Each team consists of **5 players**. Custom loadouts are allowed, but no restricted perks, weapons, or attachments.",
        "Match Duration & Format – Best-of-3 rounds; first team to win **2 matches** advances. Each match consists of **6 rounds per game**.",
        "No Exploits or Cheating – Any use of glitches, hacks, or third-party software results in **immediate disqualification**.",
        "Sportsmanship & Conduct – **No toxic behavior, harassment, or excessive trash talk**. Violations may result in penalties or disqualification."
      ]
    },
    "Battlefield": {
      title: "Battlefield Tournament Rules",
      rules: [
        "Game Mode & Map Selection – Matches will be played in **Conquest** mode. Maps will rotate according to tournament schedule.",
        "Team Size & Classes – Each team consists of **4 players**. Class distribution must include at least one Medic per team.",
        "Match Duration & Format – Best-of-3 rounds; first team to win **2 matches** advances. Each match lasts **20 minutes**.",
        "Vehicle Usage – Limited to **two vehicles per team** at any time. Aircraft limited to one per team.",
        "Sportsmanship & Anti-Cheat – All players must have **anti-cheat software running**. Violations result in team disqualification."
      ]
    }
  },
  "Sports Games": {
    "FIFA 25": {
      title: "FIFA 25 Tournament Rules",
      rules: [
        "Match Settings – **6-minute halves**, Legendary difficulty, Custom tactics allowed.",
        "Team Selection – Any club or national team allowed, except for custom teams.",
        "Tournament Format – **Double elimination** bracket. Ties resolved with extra time and penalties.",
        "Controller Settings – Players must use their own controllers. Macro buttons are prohibited.",
        "Fair Play – Excessive celebration, time-wasting, or exploits will result in warnings and potential disqualification."
      ]
    },
    "NBA 2K25": {
      title: "NBA 2K25 Tournament Rules",
      rules: [
        "Game Settings – **5-minute quarters**, Pro difficulty, Fatigue ON, Injuries OFF.",
        "Team Selection – Current NBA teams only, no All-Star or Classic teams permitted.",
        "Substitutions – **Auto-substitutions enabled**, manual substitutions allowed during timeouts only.",
        "Timeout Rules – Maximum of **3 timeouts** per game, 30 seconds each.",
        "Technical Issues – In case of disconnection, the match will be restarted with the same score if beyond first quarter."
      ]
    }
  },
  "Board Games": {
    "Chess Master": {
      title: "Chess Master Tournament Rules",
      rules: [
        "Time Control – **15 minutes** per player with **10-second increment** per move.",
        "Tournament Format – Swiss system, **7 rounds**, top 4 advance to knockout stage.",
        "Tie Breaks – Decided by Sonneborn-Berger score, then by direct encounter result.",
        "Draw Offers – No draw offers before move 30 unless position is repeated three times.",
        "Electronic Devices – No electronic devices allowed at the playing area. Violation results in forfeit."
      ]
    },
    "Monopoly": {
      title: "Monopoly Tournament Rules",
      rules: [
        "Game Duration – Maximum **90 minutes** per game, highest net worth wins if time expires.",
        "Starting Cash – Each player begins with **$1,500** as per standard rules.",
        "House Rules – No free parking jackpot, double salary for landing on GO, no property auctions.",
        "Trading – All trades must be property-for-property or involve cash. No future considerations allowed.",
        "Disputes – Tournament director has final say on all rule interpretations and disputes."
      ]
    }
  },
  "Card Games": {
    "Poker": {
      title: "Poker Tournament Rules",
      rules: [
        "Variant & Structure – **Texas Hold'em**, blinds increase every 20 minutes according to schedule.",
        "Starting Chips – Each player receives **10,000 tournament chips**. No rebuys allowed.",
        "Behavior & Etiquette – English only at the table, no phone use, one player per hand rule enforced.",
        "Dealing & Showdown – Dealer button moves clockwise, cards must be shown at showdown if called.",
        "Penalties – Warnings, missed hands, or disqualification for rule violations at TD discretion."
      ]
    }
  },
  "Dice Games": {
    "Yahtzee": {
      title: "Yahtzee Tournament Rules",
      rules: [
        "Game Format – Each player completes **3 full scorecards**. Highest combined score wins.",
        "Timing – Players have **45 seconds** to complete each decision (which dice to keep/reroll).",
        "Verification – All yahtzees must be verified by a tournament official to receive bonus points.",
        "Scoring Disputes – Video recording will be used to resolve any disputes about dice values or scoring.",
        "Equipment – Only tournament-provided dice and scorecards may be used."
      ]
    }
  }
};

// Default rules for any game without specific rules
const defaultRules: GameRuleSet = {
  title: "Tournament Rules",
  rules: [
    "Registration – All players must register at least **30 minutes** before tournament start time.",
    "Format – Single elimination bracket, matches as described in game-specific rules.",
    "Disputes – Tournament organizers have final say in all rule interpretations and disputes.",
    "Prizes – Top 3 places receive prizes according to tournament specifications.",
    "Code of Conduct – Players must maintain respectful behavior throughout the tournament."
  ]
};

interface StatusCardProps {
  logo: string;
  name: string;
  status: string;
  prize: number;
  time: string;
  borderColor: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  logo,
  name,
  status,
  prize,
  time,
  borderColor,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get game-specific rules or fall back to category rules or default rules
  const getGameRules = () => {
    if (gameRules[status]?.[name]) {
      return gameRules[status][name];
    } else if (gameRules[status]) {
      // If we have category rules but not specific game rules
      return {
        title: `${status} Tournament Rules`,
        rules: defaultRules.rules
      };
    } else {
      // Default fallback
      return {
        title: `${name} Tournament Rules`,
        rules: defaultRules.rules
      };
    }
  };

  const selectedRules = getGameRules();

  return (
    <>
      <div 
        className="bg-[#0F1218] p-5 rounded-xl flex flex-col md:flex-row items-center gap-5 w-full max-w-3xl relative shadow-lg cursor-pointer hover:bg-[#161b24] transition-colors z-auto"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Left Section with Logo */}
        <div className="flex flex-col items-center text-white">
          <Image
            src={logo}
            alt={name}
            width={60}
            height={60}
            className="w-10 h-10"
          />
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
        sub={`Prize Pool: ₦${prize} • Start Time: ${time}`}
        contentTitle={selectedRules.title}
        contentItems={selectedRules.rules}
        firstButtonText="Accept & Join"
        secondButtonText="Decline"
        onClick={() => {
          console.log(`Joining ${name} tournament`);
          setIsModalOpen(false);
          // Add navigation or registration logic here
        }}
        onTab={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default StatusCard;