"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getFn } from "@/lib/apiClient";
import { TypePrivateWager } from "../../types/global";

interface Player {
  id: string;
  name: string;
  totalScore: number;
  roundScores: number[];
  hasRolledThisRound: boolean;
  isReady: boolean;
  bet: number;
  rank?: number;
}

interface GameState {
  players: Record<string, Player>;
}

interface DiceResult {
  die1: number;
  die2: number;
  roundScore: number;
}

interface PayoutInfo {
  totalPot: number;
  houseCommission: number;
  distributablePot: number;
  yourWinnings: number;
}

export default function DiceRollGame() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const wagerId = searchParams.get("wagerId");
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState("Connecting...");
  const [yourScore, setYourScore] = useState(0);
  const [readyStatus, setReadyStatus] = useState("");
  const [isGameAreaVisible, setIsGameAreaVisible] = useState(false);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
  const [isPostGameVisible, setIsPostGameVisible] = useState(false);
  const [roundInfo, setRoundInfo] = useState("");
  const [rollTimer, setRollTimer] = useState(12);
  const [diceResult, setDiceResult] = useState<DiceResult | null>(null);
  const [playerOutcomeMessage, setPlayerOutcomeMessage] = useState("");
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [finalRank, setFinalRank] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [finalLeaderboard, setFinalLeaderboard] = useState<Player[]>([]);
  const [tiebreakerNote, setTiebreakerNote] = useState("");
  const [payoutInfo, setPayoutInfo] = useState<PayoutInfo | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (wagerId && user?.id && user?.username) {
      const initializeGame = async () => {
        try {
          // Check wager before initializing socket
          const response: TypePrivateWager = await getFn(
            `/api/privatewagers/view/${wagerId}`
          );

          if (!response) {
            throw new Error("Failed to fetch wager details");
          }

          // Set bet amount from wager data
          setBetAmount(Number(response.amount));

          // Initialize socket after successful wager check
          const socketInstance = io({
            path: "/api/socket",
            addTrailingSlash: true,
            transports: ["websocket", "polling"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
            withCredentials: true,
            forceNew: true,
            autoConnect: true,
            upgrade: true,
            rememberUpgrade: true,
          });

          socketInstance.on("connect", () => {
            console.log("Connected to server");
            setGameStatus("Connected! Waiting to join game.");
            setConnectionError(null);
            // Check wager ID and user ID immediately after connection
            socketInstance.emit("checkWagerId", { wagerId, userId: user?.id });
          });

          socketInstance.on("disconnect", () => {
            setGameStatus("Disconnected from server.");
            setConnectionError(
              "Disconnected from game server. Please refresh the page."
            );
            toast.error(
              "Disconnected from game server. Please refresh the page."
            );
          });

          socketInstance.on("registrationError", (error) => {
            toast.error(error);
          });

          socketInstance.on("systemNotification", (message) => {
            toast(message);
          });

          socketInstance.on("playerRegistered", (playerId) => {
            setMyPlayerId(playerId);
            setGameStatus(
              `Joined game! Your ID: ${playerId}. Waiting for game to start.`
            );
            setIsRegistered(true);
            toast.success("Successfully joined the game!");
          });

          socketInstance.on("playerReadyStatus", (message) => {
            setReadyStatus(message);
            toast(message);
          });

          socketInstance.on("gameLoading", (message) => {
            setGameStatus(message);
            setIsGameAreaVisible(false);
            setIsLeaderboardVisible(false);
            setIsPostGameVisible(false);
            setReadyStatus("");
            toast(message);
          });

          socketInstance.on("gameIntro", (message) => {
            toast(message);
            setIsGameAreaVisible(true);
          });

          socketInstance.on("gameStateUpdate", ({ players }: GameState) => {
            if (myPlayerId && players[myPlayerId]) {
              setYourScore(players[myPlayerId].totalScore);
              // Check if all players are ready
              const allReady = Object.values(players).every((p) => p.isReady);
              if (allReady) {
                setReadyStatus(
                  "All players are ready! Game will start soon..."
                );
              }
            }
          });

          socketInstance.on("roundStart", (data) => {
            setIsGameAreaVisible(true);
            setIsLeaderboardVisible(false);
            setRoundInfo(`Round ${data.roundNumber} of 5`);
            setRollTimer(data.rollTimeLimit);
            setPlayerOutcomeMessage("Click 'Roll Dice' to roll your two dice!");
            setDiceResult(null);
            toast.info(`Round ${data.roundNumber} has begun!`);
          });

          socketInstance.on("rollTimerUpdate", (timeLeft) => {
            setRollTimer(timeLeft);
          });

          socketInstance.on("diceRolling", () => {
            setPlayerOutcomeMessage("Rolling Dice...");
          });

          socketInstance.on("diceResult", (result) => {
            setDiceResult(result);
            setPlayerOutcomeMessage(
              `You rolled a ${result.die1} and a ${result.die2}! Round Score: ${result.roundScore}.`
            );
            toast.success(
              `Rolled ${result.die1} and ${result.die2}! Score: ${result.roundScore}`
            );
          });

          socketInstance.on("scoreUpdate", ({ newTotalScore, message }) => {
            setYourScore(newTotalScore);
            if (message) {
              setPlayerOutcomeMessage(message);
              toast.info(message);
            }
          });

          socketInstance.on("roundEndLeaderboard", ({ leaderboard }) => {
            setIsGameAreaVisible(false);
            setIsLeaderboardVisible(true);
            setLeaderboard(leaderboard);
            toast.info("Round ended! Check the leaderboard.");
          });

          socketInstance.on("nextRoundCountdown", ({ message, countdown }) => {
            toast.info(`${message} Starting in ${countdown}s...`);
          });

          socketInstance.on("calculatingFinalResults", (message) => {
            setIsLeaderboardVisible(false);
            toast.info(message);
          });

          socketInstance.on("gameOver", (data) => {
            setIsGameAreaVisible(false);
            setIsLeaderboardVisible(false);
            setIsPostGameVisible(true);
            setFinalRank(data.yourRank);
            setFinalScore(data.yourScore);
            setFinalLeaderboard(data.finalLeaderboard);
            setTiebreakerNote(data.tiebreakerNote || "");
            setPayoutInfo(data.payout);
            toast.success(
              `Game Over! You finished in ${data.yourRank}${getOrdinalSuffix(
                data.yourRank
              )} place!`
            );
          });

          socketInstance.on("redirectToMyGames", () => {
            router.push("/dashboard/my-games");
          });

          socketInstance.on("gameFound", ({ gameId }) => {
            setGameStatus("Game found! You can join now.");
            setGameId(gameId);
            toast.success("Game found! You can join now.");
          });

          socketInstance.on("createGamePrompt", ({ wagerId }) => {
            setGameStatus("No existing game found. Creating new game...");
            socketInstance.emit("createGame", { wagerId, userId: user?.id });
          });

          socketInstance.on("gameCreated", ({ gameId }) => {
            setGameId(gameId);
            setGameStatus("Game created! You can join now.");
            toast.success("Game created! You can join now.");
          });

          setSocket(socketInstance);
          setIsLoading(false);

          return () => {
            socketInstance.disconnect();
          };
        } catch (error) {
          console.error("Error initializing game:", error);
          toast.error("Failed to load wager");
          router.push("/dashboard/my-games");
        }
      };

      initializeGame();
    }
    // Redirect if no wager ID or user ID
    else if (!wagerId) {
      toast.error("Missing required parameters. Redirecting to my games...");
      router.push("/dashboard/my-games");
    }
  }, [wagerId, router, user, myPlayerId]);

  const getOrdinalSuffix = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const handleRegister = () => {
    if (
      socket &&
      betAmount &&
      wagerId &&
      user?.id &&
      user?.username &&
      gameId
    ) {
      socket.emit("joinGame", {
        name: user.username,
        bet: Number(betAmount),
        wagerId: wagerId,
        userId: user?.id,
        gameId: gameId,
      });
    } else {
      console.log("Cannot send join game signal. Missing:", {
        socket: !!socket,
        wagerId,
        userId: user?.id,
        gameId,
      });
    }
  };

  const handleReady = () => {
    if (socket && wagerId && user?.id && gameId && myPlayerId) {
      console.log("Sending ready signal with:", {
        wagerId,
        userId: user?.id,
        gameId,
        playerId: myPlayerId,
      });
      socket.emit("playerReady", {
        wagerId,
        userId: user?.id,
        gameId,
        playerId: myPlayerId,
      });
    } else {
      console.log("Cannot send ready signal. Missing:", {
        socket: !!socket,
        wagerId,
        userId: user?.id,
        gameId,
        myPlayerId,
      });
    }
  };

  const handleRollDice = () => {
    if (socket && wagerId && user?.id && gameId && myPlayerId) {
      socket.emit("rollDice", {
        wagerId,
        userId: user?.id,
        gameId,
        playerId: myPlayerId,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-2xl font-bold">Loading Game...</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="text-gray-600">
              Please wait while we set up your game.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dice Roll Challenge</h1>

        {connectionError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {connectionError}
          </div>
        )}

        <div className="mb-4">
          <p className="text-gray-600">{gameStatus}</p>
          <p className="font-semibold">Your Score: {yourScore}</p>
        </div>

        {!isRegistered ? (
          <div className="space-y-4">
            <Button onClick={handleRegister}>Join Game</Button>
          </div>
        ) : (
          !isGameAreaVisible &&
          !isLeaderboardVisible &&
          !isPostGameVisible && (
            <div className="space-y-4">
              <Button onClick={handleReady}>Ready Now</Button>
              <p className="text-gray-600">{readyStatus}</p>
            </div>
          )
        )}

        {isGameAreaVisible && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{roundInfo}</h2>
            <p className="text-gray-600">Time to Roll: {rollTimer}s</p>
            <Button onClick={handleRollDice} disabled={!!diceResult}>
              Roll Dice
            </Button>
            {diceResult && (
              <div className="text-center">
                <p>Die 1: {diceResult.die1}</p>
                <p>Die 2: {diceResult.die2}</p>
                <p>Round Score: {diceResult.roundScore}</p>
              </div>
            )}
            <p className="text-gray-600">{playerOutcomeMessage}</p>
          </div>
        )}

        {isLeaderboardVisible && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Leaderboard (Top 5)</h2>
            <ul className="space-y-2">
              {leaderboard.map((player) => (
                <li
                  key={player.id}
                  className="flex justify-between items-center p-2 bg-gray-100 rounded"
                >
                  <span>
                    {player.rank}. {player.name}
                  </span>
                  <span>{player.totalScore} pts</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isPostGameVisible && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Game Over!</h2>
            <p className="font-semibold">
              Your Final Rank: {finalRank}, Final Score: {finalScore}
            </p>
            <div>
              <h3 className="text-lg font-semibold">
                Final Leaderboard (Top 5)
              </h3>
              <ul className="space-y-2">
                {finalLeaderboard.map((player) => (
                  <li
                    key={player.id}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded"
                  >
                    <span>
                      {player.rank}. {player.name}
                    </span>
                    <span>{player.totalScore} pts</span>
                  </li>
                ))}
              </ul>
            </div>
            {tiebreakerNote && (
              <p className="text-gray-600">{tiebreakerNote}</p>
            )}
            {payoutInfo && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Payouts</h3>
                <p>Total Pot: {payoutInfo.totalPot}</p>
                <p>House Commission (10%): {payoutInfo.houseCommission}</p>
                <p>Distributable Pot: {payoutInfo.distributablePot}</p>
                <p className="font-semibold">
                  Your Winnings:{" "}
                  {payoutInfo.yourWinnings > 0
                    ? payoutInfo.yourWinnings
                    : "You did not place in a winning position."}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
