"use client";
import { CurrencyNgn, Clock, ArrowDown, ArrowUp } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";

const TransactionHistory = () => {
  // Sample transaction data; replace with your actual data source
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

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-7 w-full">
      <h1 className="text-3xl font-extrabold text-white mb-8 flex items-center gap-2">
        <CurrencyNgn size={36} className="text-orange-500" />
        Transaction History
      </h1>
      <div className="space-y-6">
        {transactions.length === 0 ? (
          <p className="text-white text-lg text-center py-10 opacity-75">
            No transactions yet. Make your first move!
          </p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-full">
                  {transaction.type === "Deposit" ? (
                    <ArrowDown size={32} className="text-orange-500" />
                  ) : (
                    <ArrowUp size={32} className="text-orange-500" />
                  )}
                </div>
                <div>
                  <h2 className="text-white text-xl font-semibold">
                    {transaction.type}
                  </h2>
                  <p className="text-gray-300 text-sm">{transaction.date}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-2">
                  <CurrencyNgn size={28} className="text-orange-500" />
                  <span className="text-[#fcf8db] text-2xl font-bold">
                    {transaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-gray-300 text-sm">Status</p>
                  <p
                    className={`text-xl font-bold ${
                      transaction.status === "Completed"
                        ? "text-[#fcf8db]"
                        : "text-gray-400"
                    }`}
                  >
                    {transaction.status}
                  </p>
                </div>
                <Link
                  href={`/transaction-details/${transaction.id}`}
                  className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200 group"
                >
                  <span>Details</span>
                  <Clock size={18} className="group-hover:scale-110 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;