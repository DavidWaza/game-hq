import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MatchCard from "./GameCards";
import StatusCard from "./SetGamesCard";
import { Plus } from "@phosphor-icons/react";

const CreateWagerBanner = () => {
  return (
    <div
      className="h-full px-5 lg:px-20"
      style={{
        background:
          "radial-gradient(circle at center, rgba(252, 248, 219, 0.2), rgba(35, 61, 77, 0.2) 80%)",
      }}
    >
      <div className="grid lg:grid-cols-2">
        <div>
          <h1 className=" text-[#FCF8DB] uppercase text-6xl py-10 lg:py-20">
            Create a public or private wager
          </h1>

          {/* Create Wager */}
          <div className="flex">
            <button className="fine-button-primary gap-2">
              Create Wager
              <Plus size={25} />
            </button>
          </div>

          {/* Upcoming Games */}
          <h1 className=" text-[#FCF8DB] uppercase text-2xl pt-10 lg:pt-20 pb-3">
            Upcoming Games
          </h1>
          <div className="space-y-5">
            <MatchCard
              team1="David Waza"
              team2="Andra"
              logo1="/assets/1-2-3.png"
              logo2={"/assets/1-4-3.png"}
              status="upcoming"
              score="0/0"
              date="20 Apr, 2025"
              time="8:00pm"
            />
            <MatchCard
              team1="Jeff Hooligan"
              team2="Antons Geff"
              logo1="/assets/1-2-3.png"
              logo2={"/assets/1-4-3.png"}
              status="upcoming"
              score="0/0"
              date="20 Apr, 2025"
              time="8:00pm"
            />
          </div>

          {/* Active games */}
          <div className="py-10">
            <h1 className=" text-[#FCF8DB] uppercase text-2xl pt-20 pb-3">
              Active Games
            </h1>
            <StatusCard
              logo="/assets/1-2-3.png"
              name="FC 25"
              status="Pending"
              prize={5000}
              time="3pm"
            />
          </div>
        </div>

        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Image
              src={"/assets/m.png"}
              alt="Soap"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full my-20 h-auto object-cover hidden md:flex"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateWagerBanner;
