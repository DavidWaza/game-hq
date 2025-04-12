"use client";
import { CurrencyNgn, Trophy, Clock, Info, X } from "@phosphor-icons/react";
import React, { useState } from "react";

const BetHistory = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedBet, setSelectedBet] = useState<null | typeof bets[0]>(null);

  const bets = [
    {
      id: 1,
      date: "2025-04-08",
      game: "Soccer Match",
      amount: 500.0,
      outcome: "Win",
      opponent: null,
    },
    {
      id: 2,
      date: "2025-04-07",
      game: "Basketball Finals",
      amount: 200.0,
      outcome: "Loss",
      opponent: "Team Thunder",
    },
    {
      id: 3,
      date: "2025-04-06",
      game: "Tennis Open",
      amount: 1000.0,
      outcome: "Pending",
      opponent: null,
    },
  ];

  // Filter bets based on active tab
  const filteredBets =
    activeTab === "All"
      ? bets
      : bets.filter((bet) => bet.outcome === activeTab);

  const tabs = ["All", "Win", "Loss", "Pending"];

  const closeModal = () => setSelectedBet(null);

  return (
    <div className="bg-gradient-to-b from-[#0f141f] to-[#1c2526] rounded-2xl p-8 w-full relative overflow-hidden">
      {/* Animated Background Effect */}
      <div className="absolute inset-0  opacity-50 animate-pulse-slow" />

      <div className="mb-8 relative z-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-6 flex items-center gap-3">
          <Trophy size={40} className="text-orange-400" />
          Bet History
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2 text-sm font-semibold transition-all duration-300 rounded-full ${
                activeTab === tab
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-[0_0_10px_rgba(255,165,0,0.7)]"
                  : "text-gray-300 bg-gray-800/50 hover:bg-gray-700 hover:text-orange-300"
              }`}
              aria-label={`Filter by ${tab} bets`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute inset-0 rounded-full border border-orange-500/50 shadow-[0_0_15px_rgba(255,165,0,0.5)] -z-10" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {filteredBets.length === 0 ? (
          <p className="text-gray-200 text-lg text-center py-10 opacity-80 font-medium">
            No {activeTab.toLowerCase()} bets found. Ignite your streak!
          </p>
        ) : (
          filteredBets.map((bet) => (
            <div
              key={bet.id}
              className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-lg p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,165,0,0.2)] transition-all duration-300 hover:scale-[1.01] flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/30 rounded-full animate-pulse-glow">
                  <Clock size={32} className="text-orange-400" />
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">{bet.game}</h2>
                  <p className="text-gray-400 text-sm">{bet.date}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-2">
                  <CurrencyNgn size={28} className="text-orange-400" />
                  <span className="text-orange-200 text-2xl font-bold">
                    {bet.amount.toFixed(2)}
                  </span>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-gray-400 text-sm">Outcome</p>
                  <p
                    className={`text-xl font-bold ${
                      bet.outcome === "Win"
                        ? "text-orange-200"
                        : bet.outcome === "Loss"
                        ? "text-red-400"
                        : "text-gray-500"
                    }`}
            >
                    {bet.outcome}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBet(bet)}
                  className="flex items-center gap-1 text-orange-400 text-sm font-medium hover:text-orange-300 transition-all duration-200 group"
                  aria-label={`View details for ${bet.game}`}
                >
                  <span>Details</span>
                  <Info
                    size={18}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedBet && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md  transform transition-all duration-300 scale-100 animate-slide-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-200">
                {selectedBet.game}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-orange-400 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">
                <span className="font-semibold text-orange-400">Date:</span>{" "}
                {selectedBet.date}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-orange-400">Amount:</span>{" "}
                <CurrencyNgn
                  size={20}
                  className="inline text-orange-400 mr-1"
                />
                {selectedBet.amount.toFixed(2)}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-orange-400">Outcome:</span>{" "}
                <span
                  className={
                    selectedBet.outcome === "Win"
                      ? "text-orange-200"
                      : selectedBet.outcome === "Loss"
                      ? "text-red-400"
                      : "text-gray-500"
                  }
                >
                  {selectedBet.outcome}
                </span>
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-orange-400">Opponent:</span>{" "}
                {selectedBet.opponent || "N/A"}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BetHistory;