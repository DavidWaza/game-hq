"use client";
import { CurrencyNgn, ArrowDown, ArrowUp } from "@phosphor-icons/react";
import React from "react";

const AccountBalance = () => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 w-full max-w-5xl shadow-2xl transition-all duration-300">
      <h1 className="text-3xl font-semibold text-white mb-8 tracking-tight">
        Account Balance
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Cards */}
        <div className="bg-gray-700/50 rounded-lg p-6 hover:bg-gray-700/70 transition-all duration-200">
          <p className="text-gray-300 text-sm font-medium mb-2">Current Balance</p>
          <div className="flex items-center">
            <CurrencyNgn size={32} className="text-teal-400" />
            <h2 className="text-3xl font-bold text-yellow-100 ml-3">10,000.00</h2>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-6 hover:bg-gray-700/70 transition-all duration-200">
          <p className="text-gray-300 text-sm font-medium mb-2">Bonus Balance</p>
          <div className="flex items-center">
            <CurrencyNgn size={32} className="text-teal-400" />
            <h2 className="text-3xl font-bold text-yellow-100 ml-3">0.00</h2>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-6 hover:bg-gray-700/70 transition-all duration-200">
          <p className="text-gray-300 text-sm font-medium mb-2">Ongoing Bet Placed</p>
          <div className="flex items-center">
            <CurrencyNgn size={32} className="text-teal-400" />
            <h2 className="text-3xl font-bold text-yellow-100 ml-3">5,000</h2>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-end">
        <button
          className="flex items-center justify-center bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          aria-label="Deposit funds"
        >
          <ArrowDown size={20} className="mr-2" />
          Deposit
        </button>
        <button
          className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          aria-label="Withdraw funds"
        >
          <ArrowUp size={20} className="mr-2" />
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default AccountBalance;