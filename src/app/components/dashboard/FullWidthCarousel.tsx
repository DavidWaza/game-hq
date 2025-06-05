"use client";
import { useCallback, useState, useMemo } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Intersect,
  Trophy,
  Info as InfoIcon,
  GameController,
  Sparkle,
  Lightning,
  ShieldCheck, // For a "confirm" or "secure" button feel
  Power, // For a stylized close button
} from "@phosphor-icons/react";
import Modal from "./Modal";
import MainModal from "@/components/Modal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { TypeGames } from "../../../../types/global";
import Button from "@/components/Button";

const cardVariants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
  },
  hover: {
    scale: 1.05,
    y: -10,
    rotateX: 8,
    rotateY: -8,
    boxShadow: "0px 20px 40px rgba(30, 58, 76, 0.4)",
    transition: { type: "spring", stiffness: 280, damping: 20 },
  },
};

const imageContainerVariants = {
  rest: { scale: 1, filter: "saturate(1) brightness(1)" },
  hover: {
    scale: 1.05,
    filter: "saturate(1.2) brightness(1.05)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

const shineVariants = {
  rest: { opacity: 0, scale: 1.2, y: "-10%" },
  hover: {
    opacity: 1,
    scale: 1.6,
    y: "0%",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const fixedActionButtonIconVariants = {
  rest: {
    rotate: 0,
    scale: 1,
  },
  hover: {
    rotate: [0, -15, 15, -10, 10, 0],
    scale: 1.25,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const fixedActionButtonVariants = {
  rest: { scale: 1, opacity: 0.95 },
  hover: {
    scale: 1.08,
    opacity: 1,
  },
  tap: { scale: 0.95 },
};

const MainDashboard = () => {
  const router = useRouter();
  const { store, setState } = useAuth();

  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOpenInvite, setIsOpenInvite] = useState<boolean>(false);
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);

  const [isGameDetailsModalOpen, setIsGameDetailsModalOpen] =
    useState<boolean>(false);
  const [gameForDetailsModal, setGameForDetailsModal] =
    useState<TypeGames | null>(null);

  const games: TypeGames[] = useMemo(() => store?.games || [], [store?.games]);
  const selectedGameData = games.find((game) => game.id === selectedGame);

  const handleGameClick = (gameId: string) => {
    setExpandedGameId((prev) => (prev === gameId ? null : gameId));
  };

  const handleCreate = useCallback(
    (type: number, gameData = selectedGameData) => {
      if (gameData) {
        setState(
          {
            game_id: gameData.id,
            matchMode: type,
          },
          "createMatch"
        );
        setIsModalOpen(false);
        router.push("/dashboard/match/create");
      }
    },
    [selectedGameData, router, setState]
  );

  const handleGameSelect = useCallback(
    (gameId: string) => {
      setSelectedGame(gameId);
      const newGame = games.find((game) => game.id === gameId);
      switch (newGame?.gametype) {
        case "tournament":
          handleCreate(1, newGame);
          break;
        case "invite":
          handleCreate(0, newGame);
          break;
        default:
          setIsModalOpen(true);
      }
    },
    [games, handleCreate]
  );

  const handleOpenGameDetailsModal = (game: TypeGames) => {
    setGameForDetailsModal(game);
    setIsGameDetailsModalOpen(true);
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

  // SVG for animated grid background pattern
  const GridPattern = () => (
    <svg
      width="100%"
      height="100%"
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
    >
      <defs>
        <pattern
          id="animatedGrid"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
          x="0"
          y="0"
        >
          <path
            d="M0 25 H50 M25 0 V50"
            stroke="rgba(0, 220, 255, 0.5)"
            strokeWidth="0.5"
          />
          <rect width="50" height="50" fill="transparent" />
          <animate
            attributeName="x"
            from="0"
            to="50"
            dur="5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            from="0"
            to="50"
            dur="7s"
            repeatCount="indefinite"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#animatedGrid)" />
    </svg>
  );

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#233d4d] via-[#2c586b] to-[#101820] px-4 pt-32 md:pt-40 pb-40 overflow-y-auto scroll-smooth">
      <motion.h1
        initial={{ opacity: 0, y: -40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
        className="text-4xl sm:text-5xl font-bold text-center text-[#fcf8db] mb-16 sm:mb-20 tracking-tight"
      >
        Choose Your Arena
      </motion.h1>

      <div className="flex flex-wrap justify-center items-start gap-x-6 gap-y-8 sm:gap-x-8 sm:gap-y-10 max-w-7xl mx-auto px-2">
        {games.map((game, index) => {
          const isExpanded = expandedGameId === game.id;
          return (
            <motion.div
              key={game.id}
              className="relative flex flex-col bg-gradient-to-br from-[#264355] to-[#1e3a4c] rounded-2xl overflow-hidden shadow-2xl w-[12.5rem] sm:w-60 cursor-pointer group"
              style={{ transformPerspective: "1200px" }}
              variants={cardVariants}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                },
              }}
              viewport={{ once: true, amount: 0.2 }}
              onClick={() => handleGameClick(game.id)}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                variants={shineVariants}
                style={{
                  background:
                    "radial-gradient(circle at 50% 30%, rgba(252, 248, 219, 0.12) 0%, rgba(252, 248, 219, 0) 65%)",
                }}
              />
              <div className="relative z-10 p-4 sm:p-5 flex flex-col items-center">
                <motion.div
                  className="w-24 h-24 sm:w-28 md:w-32 sm:h-28 md:h-32 rounded-full bg-[#2a4a5c] flex items-center justify-center shadow-lg overflow-hidden border-2 border-[#3e6074]"
                  variants={imageContainerVariants}
                >
                  <Image
                    src={game.game_image}
                    alt={game.name}
                    width={120}
                    height={120}
                    className="object-contain w-[60%] h-[60%] sm:w-[65%] sm:h-[65%] group-hover:scale-110 transition-transform duration-300 ease-out"
                  />
                </motion.div>
                <h3 className="w-full mt-4 sm:mt-5 text-sm sm:text-base md:text-lg font-semibold text-[#fcf8db] text-center tracking-wide leading-tight h-10 sm:h-12 md:h-14 flex items-center justify-center overflow-hidden">
                  <span className="line-clamp-2">{game.name}</span>
                </h3>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 15, height: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="relative z-10 bg-[#2a5266]/80 backdrop-blur-md border-t-2 border-[#fcf8db]/25 mt-auto"
                  >
                    <div className="flex flex-col items-stretch p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <motion.button
                        whileHover={{
                          scale: 1.03,
                          backgroundColor: "rgba(243, 127, 45, 0.15)",
                          x: 2,
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenGameDetailsModal(game);
                        }}
                        className="flex items-center text-left text-[#c1dce8] hover:text-[#f37f2d] transition-colors duration-200 font-medium py-2 px-3 rounded-md"
                      >
                        <InfoIcon size={18} className="mr-2 shrink-0" /> Game
                        Details
                      </motion.button>
                      <motion.button
                        whileHover={{
                          scale: 1.03,
                          backgroundColor: "rgba(243, 127, 45, 0.15)",
                          x: 2,
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGameSelect(game.id);
                        }}
                        className="flex items-center text-left text-[#c1dce8] hover:text-[#f37f2d] transition-colors duration-200 font-medium py-2 px-3 rounded-md"
                      >
                        <GameController size={18} className="mr-2 shrink-0" />{" "}
                        Create Match
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 flex flex-col items-end gap-3 sm:gap-4 z-50">
        {fixedActionButtons.map((btn) => (
          <motion.button
            key={btn.id}
            onClick={btn.action}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            variants={fixedActionButtonVariants}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
            className="flex items-center bg-gradient-to-r from-[#f37f2d] to-[#f9a825] text-[#233d4d] pl-4 pr-5 sm:pl-5 sm:pr-6 py-2.5 sm:py-3 rounded-full shadow-xl hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fcf8db] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101820] transition-all duration-200 ease-in-out group"
          >
            <motion.div
              variants={fixedActionButtonIconVariants}
              className="transition-transform duration-300 group-hover:text-white"
            >
              <btn.icon size={20} weight="bold" aria-hidden="true" />
            </motion.div>
            <span className="ml-2 sm:ml-2.5 whitespace-nowrap font-bold text-xs sm:text-sm tracking-wide group-hover:text-white transition-colors">
              {btn.label}
            </span>
          </motion.button>
        ))}
      </div>

      <Modal
        isOpen={isOpenInvite}
        setIsOpen={setIsOpenInvite}
        title="Join an Existing Wager"
        firstButtonText="Join Tournament"
        secondButtonText="My Invitations"
      />
      <MainModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="bg-gradient-to-br from-[#2c586b] to-[#233d4d] p-6 sm:p-7 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md border-2 border-[#4a7c8c]/70"
        >
          <div className="flex justify-between items-center mb-5 sm:mb-6">
            <h3 className="text-xl sm:text-2xl text-[#fcf8db] font-bold tracking-tight">{`Create Match: ${
              selectedGameData?.name || "Selected Game"
            }`}</h3>
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90, color: "#f37f2d" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsModalOpen(false)}
              className="text-[#fcf8db] text-2xl sm:text-3xl leading-none p-1 rounded-full focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </motion.button>
          </div>
          <div className="flex flex-col space-y-4 sm:space-y-5 items-center pt-2 pb-4">
            <p className="text-center text-base sm:text-lg text-[#d4d0b4] mb-3 sm:mb-4">
              Select your preferred match type:
            </p>
            <Button
              onClick={() => handleCreate(1)}
              className="w-full sm:w-4/5"
              variant="secondary"
              size="lg"
            >
              Create Tournament
            </Button>
            <Button
              variant="primary"
              onClick={() => handleCreate(0)}
              className="w-full sm:w-4/5"
              size="lg"
            >
              Invite Players
            </Button>
          </div>
        </motion.div>
      </MainModal>

      {gameForDetailsModal && (
        <MainModal
          isOpen={isGameDetailsModalOpen}
          onRequestClose={() => setIsGameDetailsModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(5px)" }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              duration: 0.5,
            }}
            className="relative bg-slate-950/80 backdrop-blur-xl p-0 rounded-2xl shadow-[0_0_60px_rgba(0,255,255,0.3),_0_0_20px_rgba(0,255,255,0.2)_inset] w-full max-w-xl sm:max-w-3xl text-slate-100 flex flex-col max-h-[90vh] border-2 border-cyan-600/70 overflow-hidden"
            style={
              {
                "--glow-color": "rgba(0, 220, 255, 0.7)", // Cyan glow
                "--accent-color": "rgba(255, 215, 0, 0.9)", // Gold accent
              } as React.CSSProperties
            }
          >
            <GridPattern /> {/* Animated grid background */}
            {/* Stylized Corner Brackets */}
            {[
              "top-1 left-1 rotate-0",
              "top-1 right-1 rotate-90",
              "bottom-1 right-1 rotate-180",
              "bottom-1 left-1 -rotate-90",
            ].map((pos) => (
              <div
                key={pos}
                className={`absolute ${pos.split(" ")[0]} ${
                  pos.split(" ")[1]
                } w-10 h-10 pointer-events-none transform ${pos.split(" ")[2]}`}
              >
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full opacity-60"
                >
                  <path
                    d="M2 2 L2 15 L15 2"
                    stroke="var(--glow-color)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse-corners"
                  />
                </svg>
              </div>
            ))}
            <div className="relative z-10 p-5 sm:p-6 flex flex-col flex-grow overflow-hidden">
              <div className="flex justify-between items-start mb-4 sm:mb-5 flex-shrink-0">
                <h3
                  className="text-3xl sm:text-4xl font-black tracking-tighter uppercase flex items-center gap-2.5"
                  style={{
                    textShadow:
                      "0 0 10px var(--glow-color), 0 0 20px var(--glow-color)",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  >
                    <Lightning
                      size={36}
                      className="text-yellow-400 drop-shadow-[0_0_8px_var(--accent-color)]"
                      weight="fill"
                    />
                  </motion.div>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-200">
                    {gameForDetailsModal.name}
                  </span>
                </h3>
                <motion.button
                  whileHover={{
                    scale: 1.15,
                    rotate: 30,
                    filter: "drop-shadow(0 0 8px var(--accent-color))",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsGameDetailsModalOpen(false)}
                  className="text-cyan-400 hover:text-yellow-400 text-3xl sm:text-4xl leading-none p-1 rounded-full focus:outline-none transition-all duration-200"
                  aria-label="Close modal"
                >
                  <Power weight="bold" />
                </motion.button>
              </div>

              <div className="overflow-y-auto flex-grow pr-2 sm:pr-3 custom-scrollbar-v2 space-y-5 sm:space-y-6 scroll-smooth">
                <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-center lg:items-start">
                  <div className="lg:w-2/5 flex-shrink-0 w-full max-w-sm lg:max-w-none mx-auto relative group p-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-700 via-purple-700 to-pink-700 rounded-lg blur-md opacity-50 group-hover:opacity-70 transition duration-500 animate-pulse-slow"></div>
                    <div className="relative rounded-md overflow-hidden shadow-2xl border-2 border-slate-700/50 p-0.5 bg-slate-800">
                      <Image
                        src={gameForDetailsModal.game_image}
                        alt={gameForDetailsModal.name}
                        width={400}
                        height={400}
                        className="relative rounded object-cover w-full aspect-square"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
                      <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-cyan-300 border border-cyan-500/50">
                        ARTWORK
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-3/5 space-y-4 sm:space-y-5">
                    <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700/60 shadow-inner">
                      <h4 className="text-xl font-bold text-cyan-300 uppercase tracking-wide mb-2.5 flex items-center border-b-2 border-cyan-600/40 pb-2.5">
                        <Sparkle
                          size={24}
                          className="mr-2.5 text-yellow-400 drop-shadow-[0_0_5px_var(--accent-color)]"
                          weight="fill"
                        />
                        Intel Briefing
                      </h4>
                      <div
                        className="prose prose-sm sm:prose-base prose-invert max-w-none text-slate-300/90 leading-relaxed game-description-prose-v2 mt-3"
                        dangerouslySetInnerHTML={{
                          __html:
                            gameForDetailsModal.description ||
                            "<p>No mission intel available for this operative. Stand by for updates.</p>",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 flex justify-center flex-shrink-0 pt-5 sm:pt-6 border-t-2 border-cyan-600/30">
                <motion.button
                  onClick={() => setIsGameDetailsModalOpen(false)}
                  className="group relative inline-flex items-center justify-center px-8 py-3.5 sm:px-10 sm:py-4 overflow-hidden font-black tracking-wider uppercase text-slate-950 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 rounded-md shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-offset-4 focus:ring-offset-slate-950"
                  whileHover={{ scale: 1.08, y: -4, filter: "brightness(1.1)" }}
                  whileTap={{ scale: 0.98, filter: "brightness(0.9)" }}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></span>
                  <span className="absolute inset-0.5 rounded-md bg-slate-950 opacity-0 group-hover:opacity-40 transition-opacity duration-400"></span>
                  <span className="relative flex items-center text-sm sm:text-base">
                    <ShieldCheck
                      size={22}
                      className="mr-2 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                      weight="bold"
                    />
                    Close
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </MainModal>
      )}
    </div>
  );
};

export default MainDashboard;
