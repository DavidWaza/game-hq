"use client";
import { useState, useEffect } from "react";
import {
  Users,
  Trophy,
  Clock,
  ChatText,
  CaretDoubleRight,
  Microphone,
  MicrophoneSlash,
  List,
  Timer,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Chat from "../Components/Message";
import FullScreenLoader from "@/app/components/dashboard/FullScreenLoader";
import { TypeGames } from "../../../../../types/global";
import { formatCurrency } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function TournamentLobby() {
  const [loading, setLoading] = useState<boolean>(true);
  const [micEnabled, setMicEnabled] = useState(true);
  // const [timeLeft, setTimeLeft] = useState(1476);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isReady, setIsReady] = useState(false); // Tracks if game is in session
  const [countdown, setCountdown] = useState<number | null>(null); // Countdown from 5
  const [selectedGame, setSelectedGame] = useState<TypeGames>();
  const [showTransition, setShowTransition] = useState(false);
  const [gameResult, setGameResult] = useState<
    "win" | "lose" | "dispute" | null
  >(null);
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;
  const { user, store } = useAuth();
  const playername = user?.username || "Challenger";

  const filterGame = () => {
    if (store.games?.length && store.singleTournament) {
      const t: TypeGames | undefined = store.games.find(
        (el) => el.id === store?.singleTournament?.game_id
      );
      if (t) {
        setSelectedGame(t);
      }
    }
  };

  useEffect(() => {
    const getTournament = async () => {
      if (!store.singleTournament) {
        setLoading(true);
        await store.dispatch.getTournament();
      }
      setLoading(false);
    };
    getTournament();
  }, [slug]);

  useEffect(() => {
    filterGame();
  }, [store.games, store.singleTournament]);

  console.log(name, "xsxsxs");
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(countdownTimer);
    } else if (countdown === 0) {
      setShowTransition(true);
      setTimeout(() => {
        setIsReady(true);
        setShowTransition(false);
        setCountdown(null);
      }, 2000);
    }
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const handleReadyClick = () => {
    setCountdown(5);
  };

  const handleWinClick = async () => {
    // Optional: Play sound effect
    // const clickSound = new Audio("/sounds/button-click.mp3");
    // clickSound.play();
    try {
      await reportGameResult("win");
      setGameResult("win");
      alert("Win reported! Waiting for opponent confirmation...");
    } catch (error) {
      console.error("Error reporting win:", error);
      alert("Failed to report win. Please try again.");
    }
  };

  const handleLoseClick = async () => {
    // Optional: Play sound effect
    // const clickSound = new Audio("/sounds/button-click.mp3");
    // clickSound.play();
    try {
      await reportGameResult("lose");
      setGameResult("lose");
      alert("Loss reported. Prize money transferred to the winner.");
    } catch (error) {
      console.error("Error reporting loss:", error);
      alert("Failed to report loss. Please try again.");
    }
  };

  const handleDisputeClick = () => {
    // Optional: Play sound effect
    // const clickSound = new Audio("/sounds/button-click.mp3");
    // clickSound.play();
    setGameResult("dispute");
    router.push("/dispute-resolution");
  };

  const reportGameResult = async (result: "win" | "lose") => {
    console.log(result);
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

  const players = [
    { id: 1, name: playername, status: "Ready", captain: true },
    { id: 2, name: "GhostShadow", status: "Ready", captain: false },
    { id: 3, name: "VipeR_X", status: "Ready", captain: false },
    { id: 4, name: "Sniper_Elite", status: "Not Ready", captain: false },
    { id: 5, name: "", status: "Empty", captain: false },
  ];

  const countdownVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.5, opacity: 0 },
  };

  const transitionVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const gameSessionVariants = {
    initial: { y: 50, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, delay: 0.3 },
    },
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 200, delay: 0.5 },
    },
  };

  const textVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.7 },
    },
  };

  const tournamentDetails = store?.singleTournament;

  return (
    <>
      {loading || !tournamentDetails || !selectedGame?.id ? (
        <FullScreenLoader isLoading={true} text="Loading Lobby" />
      ) : (
        <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
          {/* Header */}
          <header className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center justify-between flex-wrap gap-2 sm:px-6 sm:py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-orange-400 sm:text-2xl">
                <Link href="/" className="hidden lg:flex">
                  GameHQ
                </Link>
              </h1>
              <div className="px-3 py-1 bg-gray-800 rounded-full items-center hidden sm:flex">
                <Trophy size={16} className="text-orange-400 mr-2" />
                <span className="text-sm">Call of Duty Tournament</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="flex items-center px-3 py-1 bg-gray-800 rounded-full">
                <Clock size={14} className="text-orange-400 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">
                  Starts in:{" "}
                  <span className="font-bold">
                    {formatTime(Number(tournamentDetails?.match_time))}
                  </span>
                </span>
              </div>
              <div className="flex items-center px-3 py-1 bg-gray-800 rounded-full">
                <Trophy size={14} className="text-orange-400 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">
                  Prize:{" "}
                  <span className="font-bold text-green-400">
                    {formatCurrency(tournamentDetails?.amount || 0)}
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center sm:w-9 sm:h-9">
                  <span className="text-xs font-bold sm:text-sm">DW</span>
                </div>
                <span className="font-medium hidden sm:block">
                  {playername}
                </span>
                <span className="text-green-400 font-medium text-xs sm:text-sm">
                  1000 CP
                </span>
              </div>
              <button
                className="lg:hidden"
                onClick={() => setIsLeftPanelOpen(true)}
              >
                <List size={24} className="text-orange-400" />
              </button>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Panel - Team Info */}
            <div
              className={`fixed inset-y-0 left-0 w-72 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform duration-300 lg:static lg:w-80 lg:translate-x-0 z-20 ${
                isLeftPanelOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center sm:text-xl">
                  <Users size={20} className="mr-2 text-orange-400" />
                  Team Roster
                </h2>
                <button
                  className="lg:hidden"
                  onClick={() => setIsLeftPanelOpen(false)}
                >
                  <CaretDoubleRight size={20} className="text-orange-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 sm:p-5">
                <div className="text-sm text-gray-400">
                  Status: <span className="text-orange-400">Incomplete</span>
                </div>
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`p-3 rounded-lg ${
                      player.status === "Ready"
                        ? "bg-gray-800"
                        : "bg-gray-850 bg-opacity-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center sm:w-10 sm:h-10">
                          {player.status !== "Empty" ? (
                            <span className="font-bold text-orange-400">
                              {player.name.charAt(0)}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">Empty</span>
                          )}
                        </div>
                        <div className="ml-2 sm:ml-3">
                          <div className="font-medium flex items-center text-sm sm:text-base">
                            {player.name || "Invite Player"}
                            {player.captain && (
                              <span className="ml-2 text-xs px-2 py-0.5 bg-orange-400 bg-opacity-20 text-orange-400 rounded-full">
                                Captain
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-xs sm:text-sm ${
                              player.status === "Ready"
                                ? "text-green-400"
                                : "text-gray-500"
                            }`}
                          >
                            {player.status}
                          </div>
                        </div>
                      </div>

                      {player.status === "Empty" ? (
                        <button className="px-2 py-1 bg-orange-400 text-gray-900 rounded-full text-xs font-medium hover:bg-orange-500 sm:px-3">
                          Invite
                        </button>
                      ) : player.status === "Not Ready" ? (
                        <span className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400">
                          Waiting...
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 border border-gray-800 rounded-lg text-sm text-gray-400 hover:bg-gray-800 transition-colors">
                  Copy Invite Link
                </button>
              </div>

              <div className="p-4 border-t border-gray-800 sm:p-5">
                <h3 className="text-sm font-medium mb-3">Voice Chat</h3>
                <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg sm:p-3">
                  <div className="flex items-center">
                    <button
                      onClick={() => setMicEnabled(!micEnabled)}
                      className="p-1 rounded hover:bg-gray-700"
                    >
                      {micEnabled ? (
                        <Microphone size={18} className="text-green-400" />
                      ) : (
                        <MicrophoneSlash size={18} className="text-red-400" />
                      )}
                    </button>
                    <span className="ml-2 text-sm">
                      {micEnabled ? "Mic On" : "Mic Off"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="ml-1 text-xs text-gray-400">3 Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Panel - Tournament Details */}
            <div className="flex-1 flex flex-col bg-gray-950">
              <div className="p-4 flex-1 overflow-y-auto bg-[url('/api/placeholder/800/600')] bg-cover bg-center sm:p-6">
                <div className="bg-gray-900 bg-opacity-90 p-4 rounded-xl backdrop-blur-md sm:p-6">
                  <h2 className="text-2xl font-bold text-orange-400 mb-4 sm:text-3xl sm:mb-6">
                    {selectedGame?.name}
                  </h2>

                  <AnimatePresence>
                    {!isReady ? (
                      <motion.div
                        key="lobby-content"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 pb-5">
                          <div className="bg-gray-800 p-4 rounded-xl sm:p-5">
                            <h3 className="font-semibold mb-3 text-orange-400 text-lg">
                              Format
                            </h3>
                            <ul className="space-y-2 text-sm sm:space-y-3">
                              <li className="flex items-start">
                                <CaretDoubleRight
                                  size={16}
                                  className="mt-1 mr-2 text-orange-400 flex-shrink-0"
                                />
                                <span>
                                  Best-of-5 rounds; First to 2 match wins
                                  advances
                                </span>
                              </li>
                              <li className="flex items-start">
                                <CaretDoubleRight
                                  size={16}
                                  className="mt-1 mr-2 text-orange-400 flex-shrink-0"
                                />
                                <span>6 rounds per match</span>
                              </li>
                              <li className="flex items-start">
                                <CaretDoubleRight
                                  size={16}
                                  className="mt-1 mr-2 text-orange-400 flex-shrink-0"
                                />
                                <span>Search & Destroy mode</span>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-gray-800 p-4 rounded-xl sm:p-5">
                            <h3 className="font-semibold mb-3 text-orange-400 text-lg">
                              Requirements
                            </h3>
                            <ul className="space-y-2 text-sm sm:space-y-3">
                              <li className="flex items-start">
                                <CaretDoubleRight
                                  size={16}
                                  className="mt-1 mr-2 text-orange-400 flex-shrink-0"
                                />
                                <span>5 players per team</span>
                              </li>
                              <li className="flex items-start">
                                <CaretDoubleRight
                                  size={16}
                                  className="mt-1 mr-2 text-orange-400 flex-shrink-0"
                                />
                                <span>Custom loadouts permitted</span>
                              </li>
                              <li className="flex items-start">
                                <CaretDoubleRight
                                  size={16}
                                  className="mt-1 mr-2 text-orange-400 flex-shrink-0"
                                />
                                <span>Ready 5 mins before start</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div
                          style={{
                            backgroundImage: `url(${selectedGame?.banner})`,
                          }}
                          className="cod-poster rounded-xl py-4"
                        ></div>
                        <div className="mt-4 sm:mt-6">
                          <button
                            className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold py-2 px-4 rounded-xl w-full transition-colors sm:py-3 sm:px-6"
                            onClick={handleReadyClick}
                          >
                            READY UP
                          </button>

                          <div className="mt-3 text-xs text-center text-gray-400 sm:mt-4">
                            Notification will be sent when tournament begins
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="game-session"
                        variants={gameSessionVariants}
                        initial="initial"
                        animate="animate"
                        className="flex flex-col min-h-[50vh] items-center justify-center"
                      >
                        <motion.div
                          variants={iconVariants}
                          initial="initial"
                          animate="animate"
                        >
                          <Timer size={56} color="#fb923c" />
                        </motion.div>

                        <motion.div
                          variants={textVariants}
                          initial="initial"
                          animate="animate"
                          className="text-center"
                        >
                          <h2 className="text-3xl font-bold text-orange-400 sm:text-4xl">
                            Game in Session
                          </h2>
                          <p className="mt-4 text-lg text-gray-400 sm:text-xl">
                            The tournament is now underway!
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Panel - Chat */}
            <div
              className={`fixed inset-y-0 right-0 w-72 bg-gray-900 border-l border-gray-800 flex flex-col transform transition-transform duration-300 lg:static lg:w-80 lg:translate-x-0 z-20 ${
                isRightPanelOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center sm:text-xl">
                  <ChatText size={20} className="mr-2 text-orange-400" />
                  Team Chat
                </h2>
                <button
                  className="lg:hidden"
                  onClick={() => setIsRightPanelOpen(false)}
                >
                  <CaretDoubleRight
                    size={20}
                    className="text-orange-400 rotate-180"
                  />
                </button>
              </div>

              <Chat />
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-gray-900 px-4 py-3 border-t border-gray-800 flex justify-between items-center sm:px-6">
            <div className="text-xs text-gray-400 sm:text-sm">
              GameHQ © 2025. All rights reserved.
            </div>
            <div className="text-xs sm:text-sm flex items-center gap-4">
              <button
                className="text-orange-400 hover:text-orange-500 lg:hidden"
                onClick={() => setIsRightPanelOpen(true)}
              >
                <ChatText size={20} />
              </button>
              <button
                className="text-red-400 hover:text-red-500 transition-colors"
                onClick={() => router.back()}
              >
                Leave Tournament
              </button>
            </div>
          </footer>

          {/* Countdown Overlay */}
          <AnimatePresence>
            {countdown !== null && countdown > 0 && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="flex flex-col items-center"
                  variants={countdownVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  key={countdown}
                >
                  <motion.div
                    className="bg-gray-800 flex items-center justify-center p-8 rounded-full w-32 h-32 shadow-lg shadow-orange-500/30"
                    animate={{
                      boxShadow: [
                        "0 0 0px #fb923c",
                        "0 0 20px #fb923c",
                        "0 0 0px #fb923c",
                      ],
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeInOut",
                      repeat: 0,
                    }}
                  >
                    <h2 className="text-7xl font-bold text-orange-400">
                      {countdown}
                    </h2>
                  </motion.div>
                  <motion.p
                    className="text-white text-lg mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Game starting soon
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Start Transition Animation */}
          <AnimatePresence>
            {showTransition && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                variants={transitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
                  {/* Animated elements for transition effect */}
                  <motion.div
                    className="absolute w-full h-full"
                    initial={{
                      background:
                        "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 100%)",
                    }}
                    animate={{
                      background:
                        "radial-gradient(circle, rgba(251,146,60,0.3) 0%, rgba(0,0,0,1) 70%)",
                    }}
                    transition={{ duration: 1 }}
                  />

                  {/* Logo animation */}
                  <motion.div
                    className="relative z-10"
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [0, 1.2, 1],
                      rotate: [0, 0, 0],
                    }}
                    transition={{
                      duration: 1,
                      times: [0, 0.6, 1],
                    }}
                  >
                    <Trophy size={120} className="text-orange-400" />
                  </motion.div>

                  {/* Text animation */}
                  <motion.div
                    className="absolute bottom-1/3 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <h2 className="text-4xl font-bold text-orange-400 mb-2">
                      GAME ON!
                    </h2>
                    <p className="text-lg text-gray-300">Prepare for battle</p>
                  </motion.div>

                  {/* Particles effect */}
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-orange-400"
                      initial={{
                        x: 0,
                        y: 0,
                        opacity: 1,
                      }}
                      animate={{
                        x:
                          Math.random() > 0.5
                            ? Math.random() * 500
                            : Math.random() * -500,
                        y:
                          Math.random() > 0.5
                            ? Math.random() * 500
                            : Math.random() * -500,
                        opacity: 0,
                        scale: Math.random() * 3,
                      }}
                      transition={{ duration: 1.5, delay: Math.random() * 0.5 }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay for mobile panels */}
          {(isLeftPanelOpen || isRightPanelOpen) && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-10"
              onClick={() => {
                setIsLeftPanelOpen(false);
                setIsRightPanelOpen(false);
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
