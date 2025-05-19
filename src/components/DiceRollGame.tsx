"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
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
    });

    socketInstance.on("disconnect", () => {
      setGameStatus("Disconnected from server.");
      setConnectionError(
        "Disconnected from game server. Please refresh the page."
      );
    });

    socketInstance.on("playerRegistered", (playerId) => {
      setMyPlayerId(playerId);
      setGameStatus(
        `Joined game! Your ID: ${playerId}. Waiting for game to start.`
      );
      setIsRegistered(true);
    });

    socketInstance.on("registrationError", (error) => {
      addNotification(error);
    });

    socketInstance.on("systemNotification", (message) => {
      addNotification(message);
    });

    socketInstance.on("playerReadyStatus", (message) => {
      setReadyStatus(message);
    });

    socketInstance.on("gameLoading", (message) => {
      setGameStatus(message);
      setIsGameAreaVisible(false);
      setIsLeaderboardVisible(false);
      setIsPostGameVisible(false);
    });

    socketInstance.on("gameIntro", (message) => {
      addNotification(message);
    });

    socketInstance.on("gameStateUpdate", ({ players }: GameState) => {
      if (myPlayerId && players[myPlayerId]) {
        setYourScore(players[myPlayerId].totalScore);
      }
    });

    socketInstance.on("roundStart", (data) => {
      setIsGameAreaVisible(true);
      setIsLeaderboardVisible(false);
      setRoundInfo(`Round ${data.roundNumber} of 5`);
      setRollTimer(data.rollTimeLimit);
      setPlayerOutcomeMessage("Click 'Roll Dice' to roll your two dice!");
      setDiceResult(null);
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
    });

    socketInstance.on("scoreUpdate", ({ newTotalScore, message }) => {
      setYourScore(newTotalScore);
      if (message) {
        setPlayerOutcomeMessage(message);
      }
    });

    socketInstance.on("roundEndLeaderboard", ({ leaderboard }) => {
      setIsGameAreaVisible(false);
      setIsLeaderboardVisible(true);
      setLeaderboard(leaderboard);
    });

    socketInstance.on("nextRoundCountdown", ({ message, countdown }) => {
      addNotification(`${message} Starting in ${countdown}s...`);
    });

    socketInstance.on("calculatingFinalResults", (message) => {
      setIsLeaderboardVisible(false);
      addNotification(message);
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
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const addNotification = (message: string) => {
    setNotifications((prev) => [message, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== message));
    }, 5000);
  };

  const handleRegister = () => {
    if (socket && playerName && betAmount) {
      socket.emit("registerPlayer", {
        name: playerName,
        bet: Number(betAmount),
      });
    }
  };

  const handleReady = () => {
    if (socket) {
      socket.emit("playerReady");
    }
  };

  const handleRollDice = () => {
    if (socket) {
      socket.emit("rollDice");
    }
  };

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

        {notifications.length > 0 && (
          <div className="mb-4 space-y-2">
            {notifications.map((notification, index) => (
              <div key={index} className="p-2 bg-blue-100 rounded">
                {notification}
              </div>
            ))}
          </div>
        )}

        {!isRegistered ? (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Enter bet amount"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
            />
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
