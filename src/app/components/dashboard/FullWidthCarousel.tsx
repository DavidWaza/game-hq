"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Intersect, Trophy } from "@phosphor-icons/react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { TypeGames } from "../../../../types/global";

const MainDashboard = () => {
  const router = useRouter();
  const { store } = useAuth();

  const [games, setGames] = useState<TypeGames[]>([]);
  const [isOpenInvite, setIsOpenInvite] = useState(false);
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);
  const [hoveredButtonLabel, setHoveredButtonLabel] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (store?.games) {
      setGames(store.games);
    }
  }, [store]);

  const handleGameClick = (gameId: string) => {
    setExpandedGameId((prev) => (prev === gameId ? null : gameId));
  };

  // const navigateRouter = (path: string) => router.push(path);

  const fixedActionButtons = [
    {
      id: "joinWager",
      label: "Join Wager",
      icon: Intersect,
      action: () => router.push("/dashboard/join-tournament"),
    },
    {
      id: "myGames",
      label: "My Games",
      icon: Trophy,
      action: () => router.push("/dashboard/my-games"),
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#233d4d] via-[#2c586b] to-[#101820] px-4 pt-32 md:pt-52 overflow-y-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center text-[#fcf8db] mb-10"
      >
       Select Your Game
      </motion.h1>

      <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
        {games.map((game) => {
          const isExpanded = expandedGameId === game.id;

          return (
            <motion.div
              key={game.id}
              className="relative bg-[#1e3a4c] rounded-2xl overflow-hidden shadow-xl w-48 sm:w-56 cursor-pointer hover:scale-105 transition-all duration-300 group"
              onClick={() => handleGameClick(game.id)}
              whileHover={{ y: -5 }}
            >
              <div className="p-4 flex flex-col items-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#233d4d] flex items-center justify-center shadow-md">
                  <Image
                    src={game.game_image}
                    alt={game.name}
                    width={100}
                    height={100}
                    className="object-contain w-[60%] h-[60%]"
                  />
                </div>
                <h3 className="mt-4 text-sm sm:text-base font-semibold text-[#fcf8db] text-center">
                  {game.name}
                </h3>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#2e5366] border-t border-[#fcf8db]/10"
                  >
                    <div className="flex flex-col p-4 space-y-2 text-sm text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/games/${game.id}/info`);
                        }}
                        className="text-[#c1dce8] hover:text-[#f37f2d] hover:underline transition"
                      >
                        Info
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/dashboard/match/select?gameId=${game.id}`
                          );
                        }}
                        className="text-[#c1dce8] hover:text-[#f37f2d] hover:underline transition"
                      >
                        Create Game
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Buttons Bottom Left */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
        {fixedActionButtons.map((btn) => (
          <motion.button
            key={btn.id}
            onClick={btn.action}
            onMouseEnter={() => setHoveredButtonLabel(btn.label)}
            onMouseLeave={() => setHoveredButtonLabel(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#233d4d] hover:bg-[#f37f2d] text-[#fcf8db] hover:text-[#233d4d] p-3 rounded-full shadow-md focus:outline-none transition-all"
          >
            <btn.icon size={20} weight="bold" />
          </motion.button>
        ))}
      </div>

      {/* Hover Label Bottom Right */}
      <div className="fixed bottom-4 right-20 z-50">
        <AnimatePresence>
          {hoveredButtonLabel && (
            <motion.div
              key={hoveredButtonLabel}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-[#233d4d] text-[#fcf8db] text-sm px-4 py-2 rounded-md shadow-xl border border-[#4a7c8c]/50"
            >
              {hoveredButtonLabel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={isOpenInvite}
        setIsOpen={setIsOpenInvite}
        title="Join an Existing Wager"
        firstButtonText="Join Tournament"
        secondButtonText="My Invitations"
        // onClick={() => router.push("/dashboard/join-tournament")}
      />
    </div>
  );
};

export default MainDashboard;
