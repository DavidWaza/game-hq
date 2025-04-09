"use client";
import {
  CurrencyNgn,
  Trophy,
  Clock,
  Info,
  Clipboard,
} from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

const BetHistory = () => {
  const bets = [
    {
      id: 1,
      date: "2025-04-08",
      game: "Soccer Match",
      amount: 500.0,
      outcome: "Win",
    },
    {
      id: 2,
      date: "2025-04-07",
      game: "Basketball Finals",
      amount: 200.0,
      outcome: "Loss",
    },
    {
      id: 3,
      date: "2025-04-06",
      game: "Tennis Open",
      amount: 1000.0,
      outcome: "Pending",
    },
  ];

  const betId = "qwkxldjxdomna";

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(betId)
      .then(() => {
        toast.success("Bet ID copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-7 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-3 flex items-center gap-2">
          <Trophy size={36} className="text-orange-500" />
          Bet History
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-orange-500">Bet ID: {betId}</p>
          <Clipboard size={20} color="white" onClick={copyToClipboard} />
        </div>
      </div>

      <div className="space-y-6">
        {bets.length === 0 ? (
          <p className="text-white text-lg text-center py-10 opacity-75">
            No bets placed yet. Start your winning streak!
          </p>
        ) : (
          bets.map((bet) => (
            <div
              key={bet.id}
              className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-full">
                  <Clock size={32} className="text-orange-500" />
                </div>
                <div>
                  <h2 className="text-white text-xl font-semibold">
                    {bet.game}
                  </h2>
                  <p className="text-gray-300 text-sm">{bet.date}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-2">
                  <CurrencyNgn size={28} className="text-orange-500" />
                  <span className="text-[#fcf8db] text-2xl font-bold">
                    {bet.amount.toFixed(2)}
                  </span>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-gray-300 text-sm">Outcome</p>
                  <p
                    className={`text-xl font-bold ${
                      bet.outcome === "Win"
                        ? "text-[#fcf8db]"
                        : bet.outcome === "Loss"
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {bet.outcome}
                  </p>
                </div>
                <Link
                  href={`/bet-details/${bet.id}`}
                  className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200 group"
                >
                  <span>Details</span>
                  <Info
                    size={18}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BetHistory;
