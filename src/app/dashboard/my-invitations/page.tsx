"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const InviteIcon = () => (
  <svg
    className="w-5 h-5 mr-2 inline-block"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 14h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 14h-1v-1h1v1zm0-3h-1v-3h1v3z"></path>
  </svg>
);
const ArenaIcon = () => (
  <svg
    className="w-5 h-5 mr-2 inline-block"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3.5 2a.5.5 0 00-.5.5v15a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-15a.5.5 0 00-.5-.5h-13zM10 4a1 1 0 00-1 1v2H7a1 1 0 100 2h2v2a1 1 0 102 0V9h2a1 1 0 100-2h-2V5a1 1 0 00-1-1z"
      clipRule="evenodd"
    ></path>
  </svg>
);

type ViewMode = "invited" | "public";
const PlaceholderInviteCard = ({
  title,
  index,
}: {
  title: string;
  index: number;
}) => (
  <motion.div
    className="bg-gradient-to-br from-[#2a2a2a]/70 to-[#1c1c1c]/60 backdrop-blur-md p-5 rounded-xl border border-transparent hover:border-[#ff4500]/70 shadow-2xl transition-all duration-300 group relative overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, ease: "circOut" },
    }}
    whileHover={{
      scale: 1.03,
      boxShadow: "0px 10px 30px rgba(255, 69, 0, 0.3)",
    }}
  >
    <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#ff4500]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow"></div>
    <h4 className="text-xl font-semibold text-gradient-orange">{title}</h4>
    <p className="text-gray-400 text-sm mt-2">
      Your destiny awaits. View the challenge specifics: stakes, rival,
      designated battle time.
    </p>
    <div className="mt-4 flex justify-end">
      <button className="px-5 py-2 bg-gradient-to-r from-[#ff4500] to-[#ffa500] text-white text-xs font-bold uppercase rounded-md shadow-lg hover:shadow-xl hover:from-[#ffa500] hover:to-[#ff8c00] transition-all duration-300 transform hover:scale-105">
        Confront Challenge
      </button>
    </div>
  </motion.div>
);

const PlaceholderPublicGameCard = ({
  title,
  index,
}: {
  title: string;
  index: number;
}) => (
  <motion.div
    className="bg-gradient-to-br from-[#1f1f1f]/70 to-[#151515]/60 backdrop-blur-md p-5 rounded-xl border border-transparent hover:border-[#ffa500]/70 shadow-2xl transition-all duration-300 group relative"
    initial={{ opacity: 0, y: 20 }}
    animate={{
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, ease: "circOut" },
    }}
    whileHover={{
      scale: 1.03,
      boxShadow: "0px 10px 30px rgba(255, 165, 0, 0.25)",
    }}
  >
    <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#ffa500] rounded-full flex items-center justify-center shadow-lg animate-ping-slow group-hover:animate-none">
      <span className="text-black font-bold text-sm">🔥</span>
    </div>
    <h4 className="text-xl font-semibold text-gray-100 group-hover:text-gradient-gold">
      {title}
    </h4>
    <p className="text-gray-400 text-sm mt-2">
      Glory & riches await! Details: Prize pool, combatant count, entry fee.
    </p>
    <div className="mt-4 flex justify-end">
      <button className="px-5 py-2 bg-gray-700 border border-gray-600 text-gray-200 text-xs font-bold uppercase rounded-md shadow-md hover:bg-gray-600 hover:text-white hover:border-[#ffa500] transition-all duration-300 transform hover:scale-105">
        Enter Arena
      </button>
    </div>
  </motion.div>
);

const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

const CreateWagerBanner = () => {
  const { user } = useAuth() || {};
  const username = user?.username || "Challenger";
  const [viewMode, setViewMode] = useState<ViewMode>("invited");
  const router = useRouter();

  const itemVariants = {};

  const contentTransitionVariants = {
    hidden: { opacity: 0, x: viewMode === "invited" ? -60 : 60, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      x: viewMode === "invited" ? 60 : -60,
      scale: 0.9,
      transition: { duration: 0.25, ease: "anticipate" },
    },
  };

  const titleHighlight =
    viewMode === "invited" ? `${username}'s` : "Explore The";
  const titleMain = viewMode === "invited" ? "Battle Invites" : "Public Arena";

  const getButtonClass = (mode: ViewMode) => {
    const isActive = viewMode === mode;
    return `relative flex items-center justify-center px-5 py-3 md:px-7 md:py-3.5 rounded-xl font-black text-xs sm:text-sm md:text-base uppercase tracking-wider transition-all duration-300 ease-out transform focus:outline-none focus:ring-4 w-full sm:w-auto
      ${
        isActive
          ? "bg-gradient-to-br from-[#ff6b00] via-[#ff4500] to-[#ffa500] text-white shadow-[0_0_25px_rgba(255,107,0,0.7)] scale-105 ring-[#ff8c00]/70"
          : "bg-[#1a1a1a]/50 border border-[#333] text-gray-400 hover:text-white hover:border-[#ff4500]/50 hover:bg-[#222]/70 ring-transparent"
      }`;
  };

  const renderContent = () => {
    const invitedGames = [
      { id: "invite1", name: "Shadow Syndicate Duel" },
      { id: "invite2", name: "Phoenix Legion Challenge" },
    ];
    const publicGames = [
      { id: "public1", name: "Grand Gauntlet Tournament" },
      { id: "public2", name: "Blitzkrieg Battle (COD)" },
      { id: "public3", name: "Mythic FIFA Finals" },
    ];

    const currentData = viewMode === "invited" ? invitedGames : publicGames;

    const CardComponent =
      viewMode === "invited"
        ? PlaceholderInviteCard
        : PlaceholderPublicGameCard;
    const emptyMessage =
      viewMode === "invited" ? (
        <>
          The scrolls of challenge remain sealed,{" "}
          <span className="text-gradient-orange font-semibold">{username}</span>
          . Await your summons, champion!
        </>
      ) : (
        <>
          The grand arena echoes... for now.{" "}
          <span className="text-gradient-gold font-semibold">
            Forge your legend
          </span>{" "}
          or rally the challengers!
        </>
      );

    return (
      <motion.div
        key={viewMode}
        variants={contentTransitionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-5 md:space-y-6 mt-4 min-h-[300px] md:min-h-[400px]"
      >
        {currentData.length > 0 ? (
          currentData.map((item, index) => (
            <CardComponent key={item.id} title={item.name} index={index} />
          ))
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center h-full py-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.2, duration: 0.5 },
            }}
          >
            <span className="text-5xl mb-4 animate-bounce-slow">📜</span>{" "}
            <p className="text-gray-500 text-lg italic">{emptyMessage}</p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#0f0f0f] text-gray-100 overflow-x-hidden">
      <Navbar variant="primary" />

      <style jsx global>{`
        .text-gradient-orange {
          background: linear-gradient(to right, #ff8c00, #ff4500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
        .text-gradient-gold {
          background: linear-gradient(to right, #ffa500, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
        .animate-pulse-slow {
          animation: pulse-slower 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-ping-slow {
          animation: ping-slower 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping-slower {
          75%,
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-bounce-slow {
          animation: bounce-slower 2s infinite;
        }
        @keyframes bounce-slower {
          0%,
          100% {
            transform: translateY(-10%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: none;
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
      `}</style>

      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-[#c1dce8] hover:text-[#fcf8db] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#f37f2d] rounded-lg px-3 py-2 bg-[#2c586b] hover:bg-[#3a6f85] border border-[#4a7c8c]"
            aria-label="Go back to previous page"
          >
            <BackArrowIcon />
            <span>Back</span>
          </button>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-5 gap-10 md:gap-16 items-start"
        >
          <div className="lg:col-span-3 space-y-6 md:space-y-8">
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tightest leading-none"
            >
              <span className="text-gradient-orange drop-shadow-[0_2px_10px_rgba(255,107,0,0.5)]">
                {titleHighlight}
              </span>
              <br />
              <span className="text-[#f0f0f0] drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]">
                {titleMain}
              </span>
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4 py-3 md:py-4"
            >
              <button
                onClick={() => setViewMode("invited")}
                className={getButtonClass("invited")}
                aria-pressed={viewMode === "invited"}
              >
                <InviteIcon /> My Sanctum
              </button>
              <button
                onClick={() => setViewMode("public")}
                className={getButtonClass("public")}
                aria-pressed={viewMode === "public"}
              >
                <ArenaIcon /> Public Arena
              </button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 relative hidden lg:block self-center pt-10 lg:pt-0"
          >
            <motion.div
              animate={{ y: [0, -15, 0, 10, 0] }}
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <div className="relative w-full max-w-sm mx-auto lg:max-w-md aspect-[4/3.5]">
                {" "}
                <Image
                  src="/assets/m.png"
                  alt="Mystic Wager Emblem"
                  fill
                  className="object-contain drop-shadow-[0_0_30px_rgba(255,165,0,0.45)]"
                  priority
                />
                <motion.div
                  className="absolute inset-[15%] bg-gradient-to-r from-[#ff4500]/20 to-[#ffa500]/20 rounded-full blur-2xl"
                  animate={{
                    scale: [0.9, 1.1, 0.9],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "mirror",
                  }}
                />
                <motion.div
                  className="absolute w-4 h-4 bg-[#ffa500] rounded-full shadow-lg"
                  style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
                  animate={{
                    x: ["-50%", "100px", "-50%", "-120px", "-50%"],
                    y: ["-50%", "-80px", "-50%", "100px", "-50%"],
                    scale: [1, 0.7, 1, 1.2, 1],
                    rotate: [0, 180, 360, 540, 720],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <div className="absolute inset-0 pointer-events-none z-0 w-full h-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,#ff4500_2%,transparent_40%)] opacity-15"
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,#ffa500_2%,transparent_40%)] opacity-15"
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(transparent,transparent_50%,rgba(255,165,0,0.05)_50%,transparent)] bg-[length:100%_4px]"
          animate={{ y: [-100, 100] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default CreateWagerBanner;
