"use client";
import { CurrencyNgn, Clock, ArrowDown, ArrowUp, X } from "@phosphor-icons/react";
import React, { useState } from "react";

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState<{
    id: number;
    date: string;
    type: string;
    amount: number;
    status: string;
  } | null>(null);

  const transactions = [
    {
      id: 1,
      date: "2025-04-08",
      type: "Deposit",
      amount: 1000.0,
      status: "Completed",
    },
    {
      id: 2,
      date: "2025-04-07",
      type: "Withdrawal",
      amount: 300.0,
      status: "Pending",
    },
    {
      id: 3,
      date: "2025-04-06",
      type: "Deposit",
      amount: 500.0,
      status: "Completed",
    },
  ];

  // Filter transactions based on active tab
  const filteredTransactions =
    activeTab === "All"
      ? transactions
      : activeTab === "Deposit" || activeTab === "Withdrawal"
      ? transactions.filter((t) => t.type === activeTab)
      : transactions.filter((t) => t.status === activeTab);

  const tabs = ["All", "Deposit", "Withdrawal", "Completed", "Pending"];

  const closeModal = () => setSelectedTransaction(null);

  return (
    <div className="bg-gradient-to-b from-[#0f141f] to-[#1c2526] rounded-2xl p-8 w-full relative overflow-hidden">
      {/* Animated Background Effect */}
      <div className="absolute  opacity-50 animate-pulse-slow" />

      <div className="mb-8 relative z-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-6 flex items-center gap-3">
          <CurrencyNgn size={40} className="text-orange-400" />
          Transaction History
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
              aria-label={`Filter by ${tab} transactions`}
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
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-200 text-lg text-center py-10 opacity-80 font-medium">
            No {activeTab.toLowerCase()} transactions found. Make your first move!
          </p>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-lg p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,165,0,0.2)] transition-all duration-300 hover:scale-[1.01] flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/30 rounded-full animate-pulse-glow">
                  {transaction.type === "Deposit" ? (
                    <ArrowDown size={32} className="text-orange-400" />
                  ) : (
                    <ArrowUp size={32} className="text-orange-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">
                    {transaction.type}
                  </h2>
                  <p className="text-gray-400 text-sm">{transaction.date}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-2">
                  <CurrencyNgn size={28} className="text-orange-400" />
                  <span className="text-orange-200 text-2xl font-bold">
                    {transaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-gray-400 text-sm">Status</p>
                  <p
                    className={`text-xl font-bold ${
                      transaction.status === "Completed"
                        ? "text-orange-200"
                        : "text-gray-500"
                    }`}
                  >
                    {transaction.status}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTransaction(transaction)}
                  className="flex items-center gap-1 text-orange-400 text-sm font-medium hover:text-orange-300 transition-all duration-200 group"
                  aria-label={`View details for ${transaction.type} transaction`}
                >
                  <span>Details</span>
                  <Clock
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
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md shadow-[0_0_25px_rgba(255,165,0,0.4)] transform transition-all duration-300 scale-100 animate-slide-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-200">
                {selectedTransaction.type}
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
                {selectedTransaction.date}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-orange-400">Amount:</span>{" "}
                <CurrencyNgn
                  size={20}
                  className="inline text-orange-400 mr-1"
                />
                {selectedTransaction.amount.toFixed(2)}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-orange-400">Status:</span>{" "}
                <span
                  className={
                    selectedTransaction.status === "Completed"
                      ? "text-orange-200"
                      : "text-gray-500"
                  }
                >
                  {selectedTransaction.status}
                </span>
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

export default TransactionHistory;