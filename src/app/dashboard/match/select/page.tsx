"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { TypeGames } from "../../../../../types/global";

// SVG icon for the back arrow
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

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-[#2c586b] p-6 rounded-xl shadow-2xl w-full max-w-lg border border-[#4a7c8c]"
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl text-[#fcf8db] font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#fcf8db] hover:text-[#f37f2d] text-3xl leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </motion.div>
    </div>
  );
};

const SplashAvartar = () => {
  const { store, setState } = useAuth();
  const games: TypeGames[] = store.games || [];
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 90,
      },
    },
  };

  // const games: Game[] = [
  //   {
  //     id: "mk",
  //     name: "Mortal Kombat",
  //     src: "/assets/mk-av.svg",
  //     borderColor: "#b7950b",
  //     shadowColor: "#b7950b",
  //     isFull: true,
  //   },
  //   {
  //     id: "cod",
  //     name: "Call of Duty",
  //     src: "/assets/cod-av.svg",
  //     borderColor: "#FFFFFF",
  //     shadowColor: "#CCCCCC",
  //     isFull: false,
  //   },
  //   {
  //     id: "fifa",
  //     name: "EA Sports FC",
  //     src: "/assets/cards-av.svg",
  //     borderColor: "#979a9a",
  //     shadowColor: "#979a9a",
  //     isFull: false,
  //   },
  //   {
  //     id: "nba2k",
  //     name: "NBA 2K",
  //     src: "/assets/basketball-av.svg",
  //     borderColor: "#f37f2d",
  //     shadowColor: "#f37f2d",
  //     isFull: false,
  //   },
  //   {
  //     id: "ludo",
  //     name: "Ludo",
  //     src: "/assets/pawn-av.svg",
  //     borderColor: "#4CAF50",
  //     shadowColor: "#4CAF50",
  //     isFull: false,
  //   },
  // ];

  const selectedGameData = games.find((game) => game.id === selectedGame);

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      handleCloseModal();
      router.push("/dashboard/match/create");
    }
  };

  const getAvatarClasses = (game: TypeGames) => {
    const isSelected = selectedGame === game.id;
    let classes = `border-2 bg-[#233d4d] rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out group cursor-pointer hover:scale-105`;

    if (isSelected) {
      classes += ` scale-110 border-4`;
    }
    return classes;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#233d4d] via-[#2c586b] to-[#101820] flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl w-full">
        {/* Back Button */}
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

        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-center pb-8 sm:pb-10 text-4xl sm:text-5xl md:text-6xl font-bold text-balance text-[#fcf8db] tracking-tight">
              Select Your Game
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12 py-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {games.map((game) => (
              <motion.div
                key={game.id}
                variants={itemVariants}
                className="flex flex-col items-center flex-shrink-0"
              >
                <div
                  className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 ${getAvatarClasses(
                    game
                  )}`}
                  style={{
                    borderColor: "#FFFFFF",
                    boxShadow:
                      selectedGame === game.id
                        ? `0 0 20px 5px ${"#CCCCCC"}60`
                        : `0 0 10px 2px ${"#CCCCCC"}30`,
                  }}
                  onClick={() => handleGameSelect(game.id)}
                  onMouseEnter={(e) => {
                    if (selectedGame !== game.id)
                      e.currentTarget.style.boxShadow = `0 0 15px 3px ${"#CCCCCC"}50`;
                  }}
                  onMouseLeave={(e) => {
                    if (selectedGame !== game.id)
                      e.currentTarget.style.boxShadow = `0 0 10px 2px ${"#CCCCCC"}30`;
                  }}
                >
                  <div className="relative flex items-center justify-center w-full h-full">
                    <Image
                      width={112}
                      height={112}
                      src={game.game_image}
                      alt={game.name}
                      className={`w-[60%] h-[60%] sm:w-[65%] sm:h-[65%] object-contain transition-transform duration-300 group-hover:scale-110`}
                    />
                  </div>
                </div>
                <p className="text-center text-[#e0dbc5] mt-3 text-sm sm:text-base md:text-lg font-medium group-hover:text-[#fcf8db] transition-colors">
                  {game.name}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div className="my-12 md:my-20 flex gap-6 md:gap-10 flex-col sm:flex-row items-center justify-center">
            <Button
              onClick={() =>
                router.push("/dashboard/match/create?matchType=tournament")
              }
              className="w-full sm:w-auto"
            >
              Create Custom Tournament
            </Button>
            <Button
              onClick={() =>
                router.push("/dashboard/match/create?matchType=1v1")
              }
              className="w-full sm:w-auto"
              variant="primary"
            >
              Create Custom 1v1 Match
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`Create Match for: ${selectedGameData?.name || "Selected Game"}`}
      >
        <div className="flex flex-col space-y-5 items-center pt-2 pb-4">
          <p className="text-center text-lg text-[#d4d0b4] mb-3">
            Choose how you want to play:
          </p>
          <Button
            onClick={() => {
              handleCreate(1);
            }}
            className="w-full sm:w-auto"
          >
            Create Tournament
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleCreate(0);
            }}
            className="w-full sm:w-auto"
          >
            Create 1v1 Match
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SplashAvartar;
