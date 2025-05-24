"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Intersect, Trophy } from "@phosphor-icons/react";
import Modal from "./Modal";
import MainModal from "@/components/Modal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { TypeGames } from "../../../../types/global";
import Button from "@/components/Button";

const MainDashboard = () => {
  const router = useRouter();
  const { store, setState } = useAuth();

  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOpenInvite, setIsOpenInvite] = useState(false);
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);

  const games: TypeGames[] = store?.games || [];
  const selectedGameData = games.find((game) => game.id === selectedGame);

  const handleGameClick = (gameId: string) => {
    setExpandedGameId((prev) => (prev === gameId ? null : gameId));
  };

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    setIsModalOpen(true);
  };

  const handleCreate = (type: number) => {
    if (selectedGameData) {
      setState(
        {
          game_id: selectedGameData.id,
          matchMode: type,
        },
        "createMatch"
      );
      setIsModalOpen(false);
      router.push("/dashboard/match/create");
    }
  };

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

  // Variants for the icon animation on button hover
  const iconVariants = {
    rest: {
      rotate: 0,
      scale: 1,
    },
    hover: {
      rotate: -8,
      scale: 1.1,
    },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.08,
    },
    tap: { scale: 0.95 },
  };

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

      {/* Game selection area */}
      <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto pb-24">
        {games.map((game) => {
          const isExpanded = expandedGameId === game.id;
          return (
            <motion.div
              key={game.id}
              className="relative bg-[#1e3a4c] rounded-2xl overflow-hidden shadow-xl w-48 sm:w-56 cursor-pointer hover:scale-105 transition-transform duration-300 group"
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
                          handleGameSelect(game.id);
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

      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        {fixedActionButtons.map((btn) => (
          <motion.button
            key={btn.id}
            onClick={btn.action}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center bg-[#233d4d] text-[#fcf8db] pl-[14px] pr-[16px] py-[10px] rounded-full shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f37f2d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101820] transition-colors duration-200 ease-in-out hover:bg-[#f37f2d] hover:text-[#233d4d]"
          >
            <motion.div
              variants={iconVariants}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <btn.icon size={20} weight="bold" aria-hidden="true" />
            </motion.div>
            <span className="ml-2 whitespace-nowrap font-semibold text-sm">
              {btn.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isOpenInvite}
        setIsOpen={setIsOpenInvite}
        title="Join an Existing Wager"
        firstButtonText="Join Tournament"
        secondButtonText="My Invitations"
      />
      <MainModal isOpen={isModalOpen}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-[#2c586b] p-6 rounded-xl shadow-2xl w-full max-w-lg border border-[#4a7c8c]"
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl text-[#fcf8db] font-semibold">{`Create Match for: ${
              selectedGameData?.name || "Selected Game"
            }`}</h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-[#fcf8db] hover:text-[#f37f2d] text-3xl leading-none"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
          <div className="flex flex-col space-y-5 items-center pt-2 pb-4">
            <p className="text-center text-lg text-[#d4d0b4] mb-3">
              Choose how you want to play:
            </p>
            <Button
              onClick={() => handleCreate(1)}
              className="w-full sm:w-auto"
              variant="secondary"
              size="lg"
            >
              Create Tournament
            </Button>
            <Button
              variant="primary"
              onClick={() => handleCreate(0)}
              className="w-full sm:w-auto"
              size="lg"
            >
              Invite Players
            </Button>
          </div>
        </motion.div>
      </MainModal>
    </div>
  );
};

export default MainDashboard;
