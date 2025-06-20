"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Users,
  Trophy,
  Clock,
  ChatText,
  CaretDoubleRight,
  Microphone,
  MicrophoneSlash,
  List,
  CheckCircle,
  XCircle,
  WarningCircle,
  SpinnerGap,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Chat from "../Components/Message";
import FullScreenLoader from "@/app/components/dashboard/FullScreenLoader";
import { formatCurrency, formatNumber, setSearchParams } from "@/lib/utils";
import { getFn } from "@/lib/apiClient";
import {
  TypeGames,
  TypePrivateWager,
  TypePlayer,
  TypeChatMessage,
} from "../../../../../../types/global";
import { toast } from "sonner";
import { useLobbySocket } from "@/lib/useLobbySocket";

const formatTime = (timeInput: string | number | undefined): string => {
  const seconds = Number(timeInput);
  if (isNaN(seconds) || seconds < 0) {
    return "0:00";
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const reportGameResult = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

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
  initial: { y: 30, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 },
  },
  exit: { y: -30, opacity: 0, transition: { duration: 0.2 } },
};

export default function TournamentLobby() {
  // --- State Variables ---
  const [loading, setLoading] = useState<boolean>(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isReady, setIsReady] = useState<boolean | undefined>(undefined);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [selectedGame, setSelectedGame] = useState<TypeGames | undefined>();
  const [showTransition, setShowTransition] = useState(false);
  const [gameResult, setGameResult] = useState<
    "win" | "lose" | "dispute" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privateWager, setPrivateWager] = useState<
    TypePrivateWager | undefined
  >();
  const [isAllowedInLobby, setIsAllowedInLobby] = useState(false);
  const [players, setPlayers] = useState<TypePlayer[]>([]);
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      sender: string;
      message: string;
      time: string;
      type: "system" | "user";
    }>
  >([]);
  // --- Hooks ---
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const { user, store } = useAuth();

  const playername = user?.username || "Challenger";
  // playing status
  const hasEnoughPlayers = useMemo(() => {
    return players.length >= 2;
  }, [players]);

  const allPlayersReady = useMemo(() => {
    return (
      players.every((player) => player.status === "ready") && hasEnoughPlayers
    );
  }, [players, hasEnoughPlayers]);

  const currentLobbyPlayer = useMemo(() => {
    return players.find((player) => player.id === user?.id);
  }, [players, user]);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  }, []);

  // Filter the specific game based on tournament details

  // get wager
  useEffect(() => {
    const getPrivateWager = async () => {
      setLoading(true);
      try {
        const response: TypePrivateWager = await getFn(
          `/api/privatewagers/view/${slug}`
        );
        if (response) {
          setPrivateWager(response);
        }
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      getPrivateWager();
    } else {
      window.history.back();
      setLoading(false);
    }
  }, [slug]);

  // get selected game
  useEffect(() => {
    if (
      privateWager &&
      privateWager?.game_id &&
      store.games &&
      store.games.length > 0
    ) {
      const game = store.games.find((game) => game.id === privateWager.game_id);
      if (game) {
        setSelectedGame(game);
      } else {
        router.push("/dashbord/my-games");
        toast.error("Game not found!", {
          position: "top-right",
          className: "p-4",
        });
      }
    }
  }, [privateWager, store.games, isAllowedInLobby, router]);

  // check if user is allowed in this slug lobby
  useEffect(() => {
    if (
      privateWager &&
      privateWager?.users &&
      selectedGame &&
      user?.id &&
      user?.email &&
      user?.username &&
      players.length < Number(selectedGame?.maxplayers || 0)
    ) {
      const parsedUsers = JSON.parse(privateWager.users);
      if (
        parsedUsers.includes(user?.email) ||
        parsedUsers.includes(user?.username) ||
        Number(user?.id) === Number(privateWager.user_id)
      ) {
        setIsAllowedInLobby(true);
      } else {
        setIsAllowedInLobby(false);
        router.push("/dashbord/my-games");
        toast.error("You are not allowed to access this lobby", {
          position: "top-right",
          className: "p-4",
        });
      }
    }
  }, [privateWager, user, router, players, selectedGame]);

  useEffect(() => {
    if (
      allPlayersReady &&
      players.length &&
      selectedGame &&
      players.length === Number(selectedGame?.maxplayers) &&
      !isReady
    ) {
      setCountdown(5);
    }
  }, [allPlayersReady, players, selectedGame, isReady]);

  const handleReadyClick = () => {
    if (countdown === null) {
      updatePlayerStatus(
        currentLobbyPlayer?.status === "not ready" ? "ready" : "not ready"
      );
    }
  };

  const handleWinClick = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await reportGameResult();
      setGameResult("win");
    } catch {
      alert("Failed to report win. Please try again.");
      setGameResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handles clicking the "I Lost" button
  const handleLoseClick = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await reportGameResult();
      setGameResult("lose");
    } catch {
      alert("Failed to report loss. Please try again.");
      setGameResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handles clicking the "Dispute / Admin" button
  const handleDisputeClick = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      setGameResult("dispute");

      setTimeout(() => {
        router.push("/dispute-resolution");
      }, 700);
    } catch {
      alert("Failed to initiate dispute. Please try again or contact support.");
      setGameResult(null);
      setIsSubmitting(false);
    }
  };

  // Create current player object for socket
  const currentPlayer = useMemo(() => {
    if (!user?.id || !user?.username || !privateWager || !isAllowedInLobby)
      return null;
    return {
      id: Number(user.id),
      name: user.username,
      status: "not ready" as const,
      captain: Number(user.id) === Number(privateWager.user_id),
      isConnected: true,
      previousStatus: "not ready" as const,
    };
  }, [user, privateWager, isAllowedInLobby]);

  // Socket hook for lobby synchronization
  const {
    updatePlayerStatus,
    updatePlayerOnlineStatus,
    sendChatMessage,
    leaveLobby,
    isConnected: socketConnected,
    updateLobbyGameStarted,
  } = useLobbySocket(
    slug,
    isAllowedInLobby,
    currentPlayer,
    privateWager?.title,
    {
      onPlayerJoined: useCallback((player: TypePlayer) => {
        toast.success(`${player.name} joined the lobby`);
      }, []),
      onPlayerLeft: useCallback((player: TypePlayer) => {
        toast.info(`${player.name} left the lobby`);
      }, []),
      onPlayerListUpdate: useCallback((playerList: TypePlayer[]) => {
        setPlayers(playerList);
      }, []),
      onGameStarted: useCallback((gameStarted: boolean | undefined) => {
        setIsReady(gameStarted);
      }, []),
      onChatHistory: useCallback((messages: Array<TypeChatMessage>) => {
        setChatMessages(messages);
      }, []),
      onError: useCallback((error: string) => {
        toast.error(`Socket error: ${error}`);
      }, []),
    }
  );

  useEffect(() => {
    if (isReady === undefined) return;
    let countdownTimer: NodeJS.Timeout | null = null;

    if (countdown !== null && countdown > 0) {
      countdownTimer = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (countdown === 0) {
      setShowTransition(true);
      setTimeout(() => {
        setIsReady(true);
        setShowTransition(false);
        updateLobbyGameStarted(true);
        setCountdown(null);
        if (countdownTimer) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }
      }, 2000);
    }

    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [countdown, isReady, updateLobbyGameStarted]);

  // Cleanup on component unmount or navigation
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isAllowedInLobby && socketConnected) {
        // Show confirmation dialog when user tries to leave
        event.preventDefault();
        event.returnValue = "";
        if (confirm("Are you sure you want to leave the lobby?")) {
          leaveLobby();
        }
      }
    };

    const handleVisibilityChange = () => {
      if (isAllowedInLobby && socketConnected) {
        if (document.visibilityState === "hidden") {
          updatePlayerOnlineStatus(false);
        } else {
          updatePlayerOnlineStatus(true);
        }
      }
    };

    // Add event listeners for page unload and visibility change
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function for component unmount
    return () => {
      if (isAllowedInLobby && socketConnected) {
        leaveLobby();
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAllowedInLobby, socketConnected, leaveLobby, updatePlayerOnlineStatus]);

  // handle params
  useEffect(() => {
    if (isReady && players.length && privateWager && selectedGame) {
      const gameParamsObj = {
        players: JSON.stringify(
          players.map((player) => ({
            id: player.id,
            name: player.name,
          }))
        ),
        wagerInfo: JSON.stringify(privateWager),
        gameInfo: JSON.stringify(selectedGame),
      };
      console.log(setSearchParams(gameParamsObj));
    }
  }, [isReady, players, privateWager, selectedGame]);

  if (loading || !privateWager || !selectedGame?.id || !isAllowedInLobby) {
    return <FullScreenLoader isLoading={true} text="Loading Lobby..." />;
  }

  // Main component render
  return (
    <>
      <div className="justify_auto overflow-hidden h-dvh bg-gray-950 text-gray-100 font-sans">
        {/* Header Section */}
        <header className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center justify-between flex-wrap gap-2 sm:px-6 sm:py-4 !h-max max-h-max">
          {/* Left Header Content */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-orange-400 sm:text-2xl">
              <Link href="/" className="hidden lg:flex items-center gap-2">
                <Trophy size={24} />
                GameHQ
              </Link>
            </h1>
            {/* Game Name Tag */}
            <div className="px-3 py-1 bg-gray-800 rounded-full items-center hidden sm:flex">
              <Trophy size={16} className="text-orange-400 mr-2" />
              <span className="text-sm font-medium">{selectedGame?.name}</span>
            </div>
          </div>
          {/* Right Header Content */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Start Time Tag */}
            <div className="flex items-center px-3 py-1 bg-gray-800 rounded-full">
              <Clock size={14} className="text-orange-400 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">
                Starts in:{" "}
                <span className="font-bold">
                  {formatTime(privateWager?.match_time)}
                </span>
              </span>
            </div>
            {/* Prize Tag */}
            <div className="flex items-center px-3 py-1 bg-gray-800 rounded-full">
              <Trophy size={14} className="text-orange-400 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">
                Prize:{" "}
                <span className="font-bold text-green-400">
                  {formatCurrency(
                    players.length * Number(privateWager?.amount || 0)
                  )}
                </span>
              </span>
            </div>
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center ring-2 ring-orange-400 sm:w-9 sm:h-9">
                <span className="text-xs font-bold text-white sm:text-sm">
                  {playername.substring(0, 2).toUpperCase()} {/* Initials */}
                </span>
              </div>
              <span className="font-medium hidden sm:block">{playername}</span>
              {/* Socket Connection Indicator */}
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    socketConnected ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <span className="text-xs text-gray-400 hidden sm:block">
                  {socketConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
            {/* Mobile Menu Toggle (Left Panel) */}
            <button
              className="lg:hidden p-1 rounded hover:bg-gray-700"
              onClick={() => setIsLeftPanelOpen(true)}
              aria-label="Open Team Roster"
            >
              <List size={24} className="text-orange-400" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Team Roster */}
          <aside
            className={`fixed inset-y-0 left-0 w-72 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform duration-300 ease-in-out lg:static lg:w-80 lg:translate-x-0 z-20 h-full overflow-y-auto ${
              isLeftPanelOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
            }`}
            aria-label="Team Roster Panel"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2 sm:text-xl">
                <Users size={20} className="text-orange-400" />
                Team Roster
              </h2>
              <button
                className="lg:hidden p-1 rounded hover:bg-gray-700"
                onClick={() => setIsLeftPanelOpen(false)}
                aria-label="Close Team Roster"
              >
                <CaretDoubleRight size={20} className="text-orange-400" />
              </button>
            </div>

            {/* Player List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 sm:p-5">
              <div className="text-sm text-gray-400 mb-3">
                Status:{" "}
                <span className="text-orange-400 font-medium">
                  {hasEnoughPlayers
                    ? isReady && countdown === null
                      ? "Game Started!"
                      : isReady && countdown !== null
                      ? "Game Starting..."
                      : allPlayersReady
                      ? "All Players Ready"
                      : "Players are not ready"
                    : "Waiting for Players..."}
                </span>
              </div>
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`transIn p-3 rounded-lg transition-colors ${
                    player.status === "ready"
                      ? "bg-gray-800"
                      : player.status === "not ready"
                      ? "bg-gray-850 bg-opacity-60 border border-gray-700"
                      : "bg-gray-850 bg-opacity-40 border border-gray-600 opacity-60"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 sm:gap-3">
                      {/* Player Avatar/Initial */}
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold sm:w-10 sm:h-10 bg-gray-700">
                        <span className="text-orange-400">
                          {player.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      {/* Player Name & Status */}
                      <div className="flex flex-col gap-1">
                        <div className="font-medium flex items-center text-sm sm:text-base">
                          <span className="capitalize elipsis">
                            {player.name}
                          </span>
                          {player.captain && (
                            <span className="ml-2 min-w-max text-xs px-2 py-0.5 bg-orange-400 bg-opacity-20 text-orange-400 rounded-full font-semibold">
                              Captain
                            </span>
                          )}
                        </div>
                        {/* status */}
                        <div
                          className={`text-xs sm:text-sm font-medium capitalize ${
                            player.status === "ready"
                              ? "text-green-400"
                              : player.status === "not ready"
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }`}
                        >
                          {player.status === "disconnected"
                            ? "Disconnected"
                            : player.status}
                          {player.status === "disconnected" && (
                            <span className="ml-1 text-xs text-gray-400">
                              (Reconnecting...)
                            </span>
                          )}
                        </div>
                        {/* online status */}
                        <div
                          className={`text-xs sm:text-sm font-medium capitalize  bg-opacity-20 rounded-full px-2 py-0.5 max-w-max ${
                            player.online
                              ? "text-green-400 bg-green-400"
                              : "text-red-400 bg-red-400"
                          }`}
                        >
                          {player.online ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Invite Link Button */}
              <button
                onClick={copyLink}
                className="w-full mt-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:border-gray-600 transition-colors"
              >
                Copy Invite Link
              </button>
            </div>

            {/* Voice Chat Section */}
            <div className="p-4 border-t border-gray-800 sm:p-5">
              <h3 className="text-sm font-medium mb-3 text-gray-300">
                Voice Chat
              </h3>
              <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg sm:p-3">
                <div className="flex items-center">
                  {/* Mic Toggle Button */}
                  <button
                    onClick={() => setMicEnabled(!micEnabled)}
                    className="p-1 rounded hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    aria-label={
                      micEnabled ? "Mute Microphone" : "Unmute Microphone"
                    }
                  >
                    {micEnabled ? (
                      <Microphone size={18} className="text-green-400" />
                    ) : (
                      <MicrophoneSlash size={18} className="text-red-400" />
                    )}
                  </button>
                  <span className="ml-2 text-sm text-gray-300">
                    {micEnabled ? "Mic On" : "Mic Off"}
                  </span>
                </div>
                {/* Voice Status Indicator */}
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse mr-1.5"></div>
                  <span className="text-xs text-gray-400">
                    {formatNumber(
                      players.filter((player) => player.online).length
                    )}{" "}
                    Online
                  </span>{" "}
                </div>
              </div>
            </div>
          </aside>

          {/* Middle Panel - Main Content */}
          <main className="flex-1 flex flex-col bg-gray-950 overflow-y-auto">
            {/* Background Image Container */}
            <div
              className="p-4 flex-1 bg-cover bg-center sm:p-6"
              style={{
                backgroundColor: "rgba(17, 24, 39, 0.6)",
                backgroundImage: `url(${
                  selectedGame?.banner || "/assets/game-banners/cod-main.jpg"
                })`,
                backgroundBlendMode: "overlay",
              }}
            >
              {" "}
              {/* Content Overlay */}
              <div className="bg-gray-900 bg-opacity-80 p-4 rounded-xl backdrop-blur-sm sm:p-6 flex flex-col">
                {/* Added min-height and flex */}
                <h2 className="text-2xl font-bold text-orange-400 mb-4 sm:text-3xl sm:mb-6 flex-shrink-0">
                  {privateWager?.title} Lobby
                </h2>
                <div className="flex-grow flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {!isReady ? (
                      // --- LOBBY VIEW (Before Game Start) ---
                      <motion.div
                        key="lobby-content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 sm:gap-6 pb-5">
                          {/* game description */}
                          <div className="bg-gray-800 p-4 rounded-xl sm:p-5 row-span-2">
                            <h3 className="font-semibold mb-3 text-orange-400 text-lg">
                              Game Description
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-300 sm:space-y-3">
                              <li className="flex items-start">
                                <CaretDoubleRight
                                  size={16}
                                  className="mt-0.5 mr-2 text-orange-400 flex-shrink-0"
                                />
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: selectedGame?.description || "",
                                  }}
                                />
                              </li>
                            </ul>
                          </div>
                          {/* wager rules */}
                          <div className="bg-gray-800 p-4 rounded-xl sm:p-5">
                            <h3 className="font-semibold mb-3 text-orange-400 text-lg">
                              Wager Rules
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-300 sm:space-y-3">
                              <li className="flex items-start">
                                <CaretDoubleRight
                                  size={16}
                                  className="mt-0.5 mr-2 text-orange-400 flex-shrink-0"
                                />
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: privateWager?.description || "",
                                  }}
                                />
                              </li>
                            </ul>
                          </div>
                          {/* Requirements */}
                          <div className="bg-gray-800 p-4 rounded-xl sm:p-5">
                            <h3 className="font-semibold mb-3 text-orange-400 text-lg">
                              Requirements
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-300 sm:space-y-3">
                              <li className="flex items-start">
                                <CaretDoubleRight
                                  size={16}
                                  className="mt-0.5 mr-2 text-orange-400 flex-shrink-0"
                                />
                                <span>Minimum of 2 players to start</span>
                              </li>
                              <li className="flex items-start">
                                <CaretDoubleRight
                                  size={16}
                                  className="mt-0.5 mr-2 text-orange-400 flex-shrink-0"
                                />
                                <span>
                                  Maximmum of{" "}
                                  {formatNumber(
                                    Number(selectedGame?.maxplayers)
                                  )}{" "}
                                  players
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        {/* Ready Up Button Area */}
                        <div className="mt-4 sm:mt-6">
                          <button
                            className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold py-2 px-4 rounded-xl w-1/2 mx-auto transition-colors duration-200 ease-in-out sm:py-3 sm:px-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            onClick={handleReadyClick}
                            disabled={countdown !== null}
                          >
                            {countdown !== null ? (
                              <>
                                <SpinnerGap
                                  size={20}
                                  className="animate-spin"
                                />
                                Starting in {countdown}...
                              </>
                            ) : currentLobbyPlayer?.status === "ready" ? (
                              "Waiting for other players..."
                            ) : (
                              "READY UP"
                            )}
                          </button>
                          <div className="mt-3 text-xs text-center text-gray-400 sm:mt-4">
                            Match starts automatically when all players are
                            ready or at the scheduled time.
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      // --- GAME STARTED / REPORTING VIEW ---
                      <motion.div
                        key="game-session-or-reporting"
                        variants={gameSessionVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit" // Use exit variant
                        className="flex flex-col items-center justify-center w-full max-w-xl text-center px-4" // Added max-width
                      >
                        {gameResult === null && (
                          <>
                            <motion.h3
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="text-2xl font-bold text-orange-400 mb-6 sm:text-3xl"
                            >
                              Game Finished? Report Your Result:
                            </motion.h3>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="flex flex-col sm:flex-row gap-3 w-full"
                            >
                              {/* --- I Won Button --- */}
                              <button
                                onClick={handleWinClick}
                                disabled={isSubmitting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 shadow-md hover:shadow-lg disabled:shadow-none transform hover:-translate-y-0.5"
                              >
                                {isSubmitting ? (
                                  <SpinnerGap
                                    size={20}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <CheckCircle size={20} weight="bold" />
                                )}
                                <span>I Won</span>
                              </button>

                              {/* --- I Lost Button --- */}
                              <button
                                onClick={handleLoseClick}
                                disabled={isSubmitting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 shadow-md hover:shadow-lg disabled:shadow-none transform hover:-translate-y-0.5"
                              >
                                {isSubmitting ? (
                                  <SpinnerGap
                                    size={20}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <XCircle size={20} weight="bold" />
                                )}
                                <span>I Lost</span>
                              </button>

                              {/* --- Dispute Button --- */}
                              <button
                                onClick={handleDisputeClick}
                                disabled={isSubmitting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 shadow-md hover:shadow-lg disabled:shadow-none transform hover:-translate-y-0.5"
                              >
                                {isSubmitting ? (
                                  <SpinnerGap
                                    size={20}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <WarningCircle size={20} weight="bold" />
                                )}
                                <span className="text-nowrap">
                                  Dispute / Admin
                                </span>
                              </button>
                            </motion.div>
                          </>
                        )}

                        {/* State: User Reported WIN */}
                        {gameResult === "win" && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center p-6 bg-gray-800 rounded-lg shadow-lg"
                          >
                            <CheckCircle
                              size={56}
                              weight="fill"
                              className="text-green-400 mx-auto mb-4"
                            />
                            <h3 className="text-2xl font-semibold text-green-400 mb-2">
                              You Reported: WIN!
                            </h3>
                            <p className="text-gray-300 max-w-sm mx-auto">
                              Awesome! Waiting for opponent confirmation or
                              admin review.
                            </p>
                            {/* Optional: Dispute after reporting */}
                            <button
                              onClick={handleDisputeClick}
                              disabled={isSubmitting}
                              className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-700 disabled:text-gray-400 text-gray-900 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 shadow"
                            >
                              {isSubmitting ? (
                                <SpinnerGap
                                  size={18}
                                  className="animate-spin"
                                />
                              ) : (
                                <WarningCircle size={18} weight="bold" />
                              )}
                              <span>Dispute This Result</span>
                            </button>
                          </motion.div>
                        )}

                        {/* State: User Reported LOSS */}
                        {gameResult === "lose" && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center p-6 bg-gray-800 rounded-lg shadow-lg"
                          >
                            <XCircle
                              size={56}
                              weight="fill"
                              className="text-red-400 mx-auto mb-4"
                            />
                            <h3 className="text-2xl font-semibold text-red-400 mb-2">
                              You Reported: Loss
                            </h3>
                            <p className="text-gray-300 max-w-sm mx-auto">
                              Thanks for confirming. Better luck next time! The
                              result is being processed.
                            </p>
                            {/* Optional: Dispute after reporting */}
                            <button
                              onClick={handleDisputeClick}
                              disabled={isSubmitting}
                              className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-700 disabled:text-gray-400 text-gray-900 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 shadow"
                            >
                              {isSubmitting ? (
                                <SpinnerGap
                                  size={18}
                                  className="animate-spin"
                                />
                              ) : (
                                <WarningCircle size={18} weight="bold" />
                              )}
                              <span>Dispute This Result</span>
                            </button>
                          </motion.div>
                        )}

                        {/* State: User Clicked DISPUTE (Brief message before redirect) */}
                        {gameResult === "dispute" && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center p-6 bg-gray-800 rounded-lg shadow-lg"
                          >
                            <WarningCircle
                              size={56}
                              weight="fill"
                              className="text-yellow-400 mx-auto mb-4"
                            />
                            <h3 className="text-2xl font-semibold text-yellow-400 mb-2">
                              Dispute Initiated
                            </h3>
                            <p className="text-gray-300 max-w-sm mx-auto flex items-center justify-center gap-2">
                              <SpinnerGap size={20} className="animate-spin" />
                              Redirecting to dispute resolution...
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </main>

          {/* Right Panel - Chat */}
          <aside
            className={`fixed inset-y-0 right-0 !w-72 bg-gray-900 border-l border-gray-800 justify_auto transform transition-transform duration-300 ease-in-out lg:static lg:w-80 lg:translate-x-0 z-20 h-full overflow-hidden ${
              isRightPanelOpen ? "translate-x-0 shadow-xl" : "translate-x-full"
            }`}
            aria-label="Team Chat Panel"
          >
            {/* Panel Header */}
            <div className="max-h-max !flex-none !h-max p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2 sm:text-xl">
                <ChatText size={20} className="text-orange-400" />
                Team Chat
              </h2>
              <button
                className="lg:hidden p-1 rounded hover:bg-gray-700"
                onClick={() => setIsRightPanelOpen(false)}
                aria-label="Close Team Chat"
              >
                <CaretDoubleRight
                  size={20}
                  className="text-orange-400 rotate-180"
                />
              </button>
            </div>
            {/* Chat Component */}
            <Chat messages={chatMessages} sendChatMessage={sendChatMessage} />
          </aside>
        </div>

        {/* Footer Section */}
        <footer className="!max-h-max !h-max !flex-none bg-gray-900 px-4 py-3 border-t border-gray-800 flex justify-between items-center sm:px-6">
          <div className="text-xs text-gray-400 sm:text-sm">
            GameHQ © {new Date().getFullYear()}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            {/* Mobile Chat Toggle */}
            <button
              className="text-orange-400 hover:text-orange-500 lg:hidden p-1 rounded hover:bg-gray-700"
              onClick={() => setIsRightPanelOpen(true)}
              aria-label="Open Team Chat"
            >
              <ChatText size={20} />
            </button>
            {/* Leave Button */}
            <button
              className="text-red-400 hover:text-red-500 transition-colors text-xs sm:text-sm font-medium"
              onClick={() => {
                if (confirm("Are you sure you want to leave the lobby?")) {
                  if (isAllowedInLobby && socketConnected) {
                    leaveLobby();
                  }
                  router.back();
                }
              }}
            >
              Leave Tournament
            </button>
          </div>
        </footer>

        {/* --- Overlays and Modals --- */}

        {/* Countdown Overlay */}
        <AnimatePresence>
          {countdown !== null && countdown > 0 && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-modal="true"
              role="dialog"
            >
              <motion.div
                className="flex flex-col items-center"
                variants={countdownVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                key={countdown} // Re-trigger animation on number change
              >
                <motion.div
                  className="bg-gray-800 flex items-center justify-center p-8 rounded-full w-32 h-32 shadow-lg shadow-orange-500/30 ring-4 ring-orange-500/50"
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(251, 146, 60, 0)", // fb923c in rgba
                      "0 0 30px rgba(251, 146, 60, 0.6)",
                      "0 0 0px rgba(251, 146, 60, 0)",
                    ],
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                >
                  <h2 className="text-7xl font-bold text-orange-400 tabular-nums">
                    {countdown}
                  </h2>
                </motion.div>
                <motion.p
                  className="text-white text-lg mt-6 font-semibold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Game starting soon...
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Start Transition Animation - RESTORED */}
        <AnimatePresence>
          {showTransition && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden" // Added overflow-hidden
              variants={transitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }} // Control overall fade in/out
              aria-hidden="true"
            >
              {/* Container for all transition elements */}
              <motion.div className="relative w-full h-full flex items-center justify-center">
                {/* Animated Background Gradient */}
                <motion.div
                  className="absolute inset-0 w-full h-full" // Use inset-0
                  initial={{
                    background:
                      "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 100%)",
                  }}
                  animate={{
                    background:
                      "radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, rgba(0,0,0,1) 75%)", // Adjusted gradient
                  }}
                  transition={{ duration: 1, delay: 0.1 }} // Slightly delayed gradient animation
                />

                {/* Logo animation */}
                <motion.div
                  className="relative z-10" // Ensure logo is above background
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.2, 1], // Bounce effect
                    opacity: [0, 1, 1],
                    rotate: [0, 10, -5, 0], // Slight rotation effect
                  }}
                  transition={{
                    duration: 1,
                    times: [0, 0.6, 1], // Timing for scale/opacity
                    delay: 0.2, // Delay logo appearance
                    ease: "backInOut",
                  }}
                >
                  <Trophy
                    size={120}
                    className="text-orange-400 drop-shadow-lg"
                  />{" "}
                  {/* Added drop shadow */}
                </motion.div>

                {/* Text animation */}
                <motion.div
                  className="absolute bottom-[30%] text-center z-10" // Position text lower, ensure above background
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }} // Text fades in later
                >
                  <h2 className="text-4xl font-bold text-orange-400 mb-2 drop-shadow-md">
                    GAME ON!
                  </h2>
                  <p className="text-lg text-gray-200 drop-shadow-sm">
                    Prepare for battle
                  </p>
                </motion.div>

                {/* Particles effect */}
                {[...Array(30)].map(
                  (
                    _,
                    i // Increased particle count
                  ) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-orange-400 z-0" // Ensure particles are behind logo/text
                      style={{
                        // Randomize size
                        width: `${Math.random() * 6 + 2}px`,
                        height: `${Math.random() * 6 + 2}px`,
                        // Start particles near the center
                        top: "50%",
                        left: "50%",
                      }}
                      initial={{
                        x: "-50%", // Center particle initially
                        y: "-50%",
                        opacity: 1,
                        scale: Math.random() * 0.5 + 0.5, // Random initial scale
                      }}
                      animate={{
                        // Move particles outwards randomly
                        x: `${(Math.random() - 0.5) * 1000}%`, // Wider spread
                        y: `${(Math.random() - 0.5) * 1000}%`,
                        opacity: 0,
                        scale: 0, // Shrink to nothing
                      }}
                      transition={{
                        duration: 1.5 + Math.random() * 1, // Random duration
                        delay: 0.1 + Math.random() * 0.4, // Staggered start
                        ease: "easeOut",
                      }}
                    />
                  )
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay for mobile panels */}
        {(isLeftPanelOpen || isRightPanelOpen) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 lg:hidden z-10 backdrop-blur-sm"
            onClick={() => {
              setIsLeftPanelOpen(false);
              setIsRightPanelOpen(false);
            }}
            aria-hidden="true" // Click away closes panels
          />
        )}
      </div>
    </>
  );
}
