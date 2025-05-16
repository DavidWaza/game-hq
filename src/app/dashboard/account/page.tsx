"use client";
import { useState } from "react";
import {
  Wallet,
  ArrowDown,
  ArrowUp,
  CreditCard,
  Clock,
  ArrowsClockwise,
  Coins,
  CurrencyNgn,
} from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";

export default function DigitalWallet() {
  const { user } = useAuth();
  const accountname = user?.username ?? "Game User";

  const [balance, setBalance] = useState(Number(user?.wallet?.balance || 0));
  const [savingsBalance, setSavingsBalance] = useState(5000);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferType, setTransferType] = useState("");

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "deposit",
      amount: 2500,
      date: "2025-04-15",
      status: "completed",
    },
    {
      id: 2,
      type: "withdraw",
      amount: 1000,
      date: "2025-04-12",
      status: "completed",
    },
    {
      id: 3,
      type: "transfer to savings",
      amount: 350,
      date: "2025-04-08",
      status: "completed",
    },
    {
      id: 4,
      type: "payment",
      amount: 120,
      date: "2025-04-05",
      status: "completed",
    },
  ]);

  const handleDeposit = () => {
    if (
      !transferAmount ||
      isNaN(Number(transferAmount)) ||
      Number(transferAmount) <= 0
    )
      return;

    const amount = Number(transferAmount);
    setBalance((prevBalance) => prevBalance + amount);
    setTransactions((prev) => [
      {
        id: Date.now(),
        type: "deposit",
        amount: amount,
        date: new Date().toISOString().split("T")[0],
        status: "completed",
      },
      ...prev,
    ]);
    setTransferAmount("");
    setShowDepositModal(false);
  };

  const handleWithdraw = () => {
    if (
      !transferAmount ||
      isNaN(Number(transferAmount)) ||
      Number(transferAmount) <= 0 ||
      Number(transferAmount) > balance
    )
      return;

    const amount = Number(transferAmount);
    setBalance((prevBalance) => prevBalance - amount);
    setTransactions((prev) => [
      {
        id: Date.now(),
        type: "withdraw",
        amount: amount,
        date: new Date().toISOString().split("T")[0],
        status: "completed",
      },
      ...prev,
    ]);
    setTransferAmount("");
    setShowWithdrawModal(false);
  };

  const handleTransfer = () => {
    if (
      !transferAmount ||
      isNaN(Number(transferAmount)) ||
      Number(transferAmount) <= 0
    )
      return;

    const amount = Number(transferAmount);
    if (transferType === "toSavings" && amount <= balance) {
      setBalance((prevBalance) => prevBalance - amount);
      setSavingsBalance((prevSavings) => prevSavings + amount);
      setTransactions((prev) => [
        {
          id: Date.now(),
          type: "transfer to savings",
          amount: amount,
          date: new Date().toISOString().split("T")[0],
          status: "completed",
        },
        ...prev,
      ]);
      setActiveTab("dashboard"); // Go back to dashboard after transfer
    } else if (transferType === "fromSavings" && amount <= savingsBalance) {
      setSavingsBalance((prevSavings) => prevSavings - amount);
      setBalance((prevBalance) => prevBalance + amount);
      setTransactions((prev) => [
        {
          id: Date.now(),
          type: "transfer from savings",
          amount: amount,
          date: new Date().toISOString().split("T")[0],
          status: "completed",
        },
        ...prev,
      ]);
      setActiveTab("dashboard"); // Go back to dashboard after transfer
    }
    setTransferAmount("");
    setTransferType("");
  };

  // Add state for card toggles
  const [cardLocked, setCardLocked] = useState(false);
  //   const [onlinePurchasesEnabled, setOnlinePurchasesEnabled] = useState(true);
  //   const [atmWithdrawalsEnabled, setAtmWithdrawalsEnabled] = useState(true);

  // Add state for transaction filtering
  const [filterType, setFilterType] = useState("all");

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "all") return true;
    if (filterType === "deposits")
      return t.type === "deposit" || t.type === "transfer from savings";
    if (filterType === "withdrawals")
      return (
        t.type === "withdraw" ||
        t.type === "transfer to savings" ||
        t.type === "payment"
      );
    if (filterType === "transfers") return t.type.includes("transfer");
    return true;
    // Add date filtering logic based on filterPeriod if implemented
  });

  return (
    <>
      <Navbar variant="primary" />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 md:p-8 text-white !pt-52">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Wallet size={32} className="text-teal-400 mr-3" />
              <h1 className="text-2xl md:text-3xl font-bold">Digital Wallet</h1>
            </div>
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === "dashboard"
                    ? "bg-teal-600 text-white"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === "transactions"
                    ? "bg-teal-600 text-white"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab("cards")}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === "cards"
                    ? "bg-teal-600 text-white"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Cards
              </button>
            </div>
          </div>

          {activeTab === "dashboard" && (
            <>
              {/* Account Summary */}
              <div className="transIn grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <p className="text-gray-300 text-sm font-medium mb-2">
                    Current Balance
                  </p>
                  <div className="flex items-center">
                    <Coins size={28} className="text-teal-400" />
                    <h2 className="text-3xl font-bold text-white ml-3 flex items-center">
                      {formatCurrency(balance)}
                    </h2>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => setShowDepositModal(true)}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm py-2 rounded-md transition-all"
                    >
                      Deposit
                    </button>
                    <button
                      onClick={() => setShowWithdrawModal(true)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm py-2 rounded-md transition-all"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <p className="text-gray-300 text-sm font-medium mb-2">
                    Savings Account
                  </p>
                  <div className="flex items-center">
                    <Bank size={28} className="text-blue-400" />
                    <h2 className="text-3xl font-bold text-white ml-3">
                      $
                      {savingsBalance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </h2>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => {
                        setTransferType("toSavings");
                        setActiveTab("transfer");
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-md transition-all"
                    >
                      To Savings
                    </button>
                    <button
                      onClick={() => {
                        setTransferType("fromSavings");
                        setActiveTab("transfer");
                      }}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-md transition-all"
                    >
                      From Savings
                    </button>
                  </div>
                </div> */}

                {/* <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <p className="text-gray-300 text-sm font-medium mb-2">
                    Monthly Overview (Demo)
                  </p>
                  <div className="flex items-center">
                    <ChartLineUp size={28} className="text-purple-400" />
                    <div className="ml-3">
                      <div className="text-sm text-gray-300">
                        Income: <span className="text-green-400">+$4,580</span>
                      </div>
                      <div className="text-sm text-gray-300">
                        Spending: <span className="text-red-400">-$2,850</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-700/50 h-2 rounded-full">
                    <div className="bg-purple-500 h-2 rounded-full w-2/3"></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    65% of monthly budget used
                  </div>
                </div> */}
              </div>

              {/* Quick Actions */}
              <div className="transIn mb-8">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  <button
                    onClick={() => setActiveTab("transfer")}
                    className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl flex flex-col items-center justify-center transition-all"
                  >
                    <ArrowsClockwise size={24} className="text-teal-400 mb-2" />
                    <span className="text-sm">Transfer</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("cards")}
                    className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl flex flex-col items-center justify-center transition-all"
                  >
                    <CreditCard size={24} className="text-blue-400 mb-2" />
                    <span className="text-sm">Cards</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("transactions")}
                    className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl flex flex-col items-center justify-center transition-all"
                  >
                    <Clock size={24} className="text-yellow-400 mb-2" />
                    <span className="text-sm">History</span>
                  </button>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="transIn">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Transactions</h2>
                  <button
                    onClick={() => setActiveTab("transactions")}
                    className="text-teal-400 hover:text-teal-300 text-sm transition-colors"
                  >
                    View All
                  </button>
                </div>
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                  {transactions.length === 0 && (
                    <div className="p-4 text-center text-gray-400">
                      No transactions yet.
                    </div>
                  )}
                  {transactions.slice(0, 3).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border-b border-gray-700 last:border-0 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "deposit" ||
                            transaction.type === "transfer from savings"
                              ? "bg-green-500/20"
                              : transaction.type === "withdraw" ||
                                transaction.type === "transfer to savings"
                              ? "bg-red-500/20"
                              : transaction.type === "payment"
                              ? "bg-yellow-500/20"
                              : "bg-blue-500/20" // Default for other types
                          }`}
                        >
                          {(transaction.type === "deposit" ||
                            transaction.type === "transfer from savings") && (
                            <ArrowDown size={20} className="text-green-400" />
                          )}
                          {(transaction.type === "withdraw" ||
                            transaction.type === "transfer to savings") && (
                            <ArrowUp size={20} className="text-red-400" />
                          )}
                          {transaction.type === "payment" && (
                            <CreditCard size={20} className="text-yellow-400" />
                          )}
                          {/* Add a general icon if needed, or refine logic for specific transfer types */}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium capitalize">
                            {transaction.type}
                          </p>
                          <p className="text-xs text-gray-400">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`font-medium flex items-center ${
                          transaction.type === "deposit" ||
                          transaction.type === "transfer from savings"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "deposit" ||
                        transaction.type === "transfer from savings"
                          ? "+"
                          : "-"}
                        {formatCurrency(Number(transaction.amount))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "transactions" && (
            <div
              key="transactions"
              className="transIn bg-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-6">
                Transaction History
              </h2>
              <div className="flex flex-col sm:flex-row justify-between mb-4 text-sm gap-4">
                <div className="flex flex-wrap space-x-2">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      filterType === "all"
                        ? "bg-teal-600 text-white"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType("deposits")}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      filterType === "deposits"
                        ? "bg-teal-600 text-white"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    Income
                  </button>
                  <button
                    onClick={() => setFilterType("withdrawals")}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      filterType === "withdrawals"
                        ? "bg-teal-600 text-white"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    Expenses
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                      <th className="pb-3 pl-2">Type</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3 pr-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td className="text-center py-8 text-gray-400">
                          No transactions match the current filter.
                        </td>
                      </tr>
                    )}
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-700 last:border-0 hover:bg-gray-700/20"
                      >
                        <td className="py-4 pl-2 flex items-center">
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${
                                transaction.type === "deposit" ||
                                transaction.type === "transfer from savings"
                                  ? "bg-green-500/20"
                                  : transaction.type === "withdraw" ||
                                    transaction.type === "transfer to savings"
                                  ? "bg-red-500/20"
                                  : transaction.type === "payment"
                                  ? "bg-yellow-500/20"
                                  : "bg-blue-500/20" // Default
                              }`}
                            >
                              {(transaction.type === "deposit" ||
                                transaction.type ===
                                  "transfer from savings") && (
                                <ArrowDown
                                  size={16}
                                  className="text-green-400"
                                />
                              )}
                              {(transaction.type === "withdraw" ||
                                transaction.type === "transfer to savings") && (
                                <ArrowUp size={16} className="text-red-400" />
                              )}
                              {transaction.type === "payment" && (
                                <CreditCard
                                  size={16}
                                  className="text-yellow-400"
                                />
                              )}
                            </div>
                            <span className="capitalize text-sm">
                              {transaction.type}
                            </span>
                          </div>
                        </td>
                        <td className="text-sm">{transaction.date}</td>
                        <td
                          className={`text-sm flex items-center ${
                            transaction.type === "deposit" ||
                            transaction.type === "transfer from savings"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {transaction.type === "deposit" ||
                          transaction.type === "transfer from savings"
                            ? "+"
                            : "-"}
                          {formatCurrency(Number(transaction.amount))}
                        </td>
                        <td className="pr-2">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs capitalize ${
                              transaction.status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : transaction.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400" // Example for failed status
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "cards" && (
            <div key="cards" className="transIn bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Your Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1 */}
                <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-6 shadow-lg relative overflow-hidden min-h-[200px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 opacity-50"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8">
                      <div className="text-sm font-light">Digital Bank</div>
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <div className="text-sm font-light mb-1">Card Number</div>
                      <div className="font-mono text-xl tracking-wider">
                        •••• •••• •••• 4582
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10 flex justify-between items-end">
                    <div>
                      <div className="text-xs font-light mb-1">Card Holder</div>
                      <div className="font-medium">{accountname}</div>
                    </div>
                    <div>
                      <div className="text-xs font-light mb-1">Expires</div>
                      <div className="font-medium">12/28</div>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-6 shadow-lg relative overflow-hidden min-h-[200px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 opacity-50"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8">
                      <div className="text-sm font-light">Digital Bank</div>
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <div className="text-sm font-light mb-1">Card Number</div>
                      <div className="font-mono text-xl tracking-wider">
                        •••• •••• •••• 7291
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10 flex justify-between items-end">
                    <div>
                      <div className="text-xs font-light mb-1">Card Holder</div>
                      <div className="font-medium">{accountname}</div>
                    </div>
                    <div>
                      <div className="text-xs font-light mb-1">Expires</div>
                      <div className="font-medium">08/26</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Settings */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Card Settings</h3>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  {/* Lock Card Toggle */}
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-600">
                    <div>
                      <div className="font-medium">Lock Card</div>
                      <div className="text-sm text-gray-400">
                        Temporarily {cardLocked ? "unlock" : "lock"} your card
                      </div>
                    </div>
                    <button
                      onClick={() => setCardLocked(!cardLocked)}
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ease-in-out ${
                        cardLocked ? "bg-red-600" : "bg-gray-600"
                      }`}
                      aria-pressed={cardLocked}
                    >
                      <span className="sr-only">Lock Card</span>
                      <span
                        className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ease-in-out ${
                          cardLocked ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      ></span>
                    </button>
                  </div>
                  {/* Online Purchases Toggle */}
                  {/* <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-600">
                    <div>
                      <div className="font-medium">Online Purchases</div>
                      <div className="text-sm text-gray-400">
                        {onlinePurchasesEnabled ? "Disable" : "Enable"} online
                        transactions
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setOnlinePurchasesEnabled(!onlinePurchasesEnabled)
                      }
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ease-in-out ${
                        onlinePurchasesEnabled ? "bg-teal-600" : "bg-gray-600"
                      }`}
                      aria-pressed={onlinePurchasesEnabled}
                    >
                      <span className="sr-only">Enable Online Purchases</span>
                      <span
                        className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ease-in-out ${
                          onlinePurchasesEnabled
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      ></span>
                    </button>
                  </div> */}
                  {/* ATM Withdrawals Toggle */}
                  {/* <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">ATM Withdrawals</div>
                      <div className="text-sm text-gray-400">
                        {atmWithdrawalsEnabled ? "Disable" : "Enable"} ATM
                        withdrawals
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setAtmWithdrawalsEnabled(!atmWithdrawalsEnabled)
                      }
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ease-in-out ${
                        atmWithdrawalsEnabled ? "bg-teal-600" : "bg-gray-600"
                      }`}
                      aria-pressed={atmWithdrawalsEnabled}
                    >
                      <span className="sr-only">Enable ATM Withdrawals</span>
                      <span
                        className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ease-in-out ${
                          atmWithdrawalsEnabled
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      ></span>
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          )}

          {activeTab === "transfer" && (
            <div
              key="transfer"
              className="transIn bg-gray-800 rounded-xl p-6 max-w-lg mx-auto"
            >
              <h2 className="text-xl font-semibold mb-6">Transfer Funds</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Transfer Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTransferType("toSavings")}
                    className={`py-3 px-4 rounded-lg border ${
                      transferType === "toSavings"
                        ? "border-teal-500 bg-teal-500/20 text-white ring-1 ring-teal-500"
                        : "border-gray-600 text-gray-400 hover:border-gray-500 hover:bg-gray-700"
                    } transition-all`}
                  >
                    To Savings
                  </button>
                  <button
                    onClick={() => setTransferType("fromSavings")}
                    className={`py-3 px-4 rounded-lg border ${
                      transferType === "fromSavings"
                        ? "border-teal-500 bg-teal-500/20 text-white ring-1 ring-teal-500"
                        : "border-gray-600 text-gray-400 hover:border-gray-500 hover:bg-gray-700"
                    } transition-all`}
                  >
                    From Savings
                  </button>
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="transferAmount"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <CurrencyNgn />
                  </span>
                  <input
                    id="transferAmount"
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.00"
                    className="block w-full pl-8 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white"
                    min="0.01"
                    step="0.01"
                  />
                </div>
                {transferType === "toSavings" && (
                  <p className="text-sm text-gray-400 mt-2 flex items-center">
                    Available balance:
                    {formatCurrency(balance)}
                  </p>
                )}
                {transferType === "fromSavings" && (
                  <p className="text-sm text-gray-400 mt-2 flex items-center">
                    Available in savings:
                    {formatCurrency(savingsBalance)}
                  </p>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setTransferAmount("");
                    setTransferType("");
                  }} // Reset state on cancel
                  className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={
                    !transferType ||
                    !transferAmount ||
                    Number(transferAmount) <= 0 ||
                    (transferType === "toSavings" &&
                      Number(transferAmount) > balance) ||
                    (transferType === "fromSavings" &&
                      Number(transferAmount) > savingsBalance)
                  }
                  className={`flex-1 py-2 px-4 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Transfer
                </button>
              </div>
            </div>
          )}

          {/* Deposit Modal */}
          {showDepositModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Deposit Funds
                </h3>
                <div className="mb-6">
                  <label
                    htmlFor="depositAmount"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <CurrencyNgn />
                    </span>
                    <input
                      id="depositAmount"
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0.00"
                      className="block w-full pl-8 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white"
                      autoFocus
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowDepositModal(false);
                      setTransferAmount("");
                    }}
                    className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeposit}
                    disabled={!transferAmount || Number(transferAmount) <= 0}
                    className={`flex-1 py-2 px-4 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Deposit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Withdraw Modal */}
          {showWithdrawModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Withdraw Funds
                </h3>
                <div className="mb-6">
                  <label
                    htmlFor="withdrawAmount"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <CurrencyNgn />
                    </span>
                    <input
                      id="withdrawAmount"
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0.00"
                      className="block w-full pl-8 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white"
                      autoFocus
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2 flex items-center">
                    Available balance:
                    {formatCurrency(balance)}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setTransferAmount("");
                    }}
                    className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdraw}
                    disabled={
                      !transferAmount ||
                      Number(transferAmount) <= 0 ||
                      Number(transferAmount) > balance
                    }
                    className={`flex-1 py-2 px-4 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>{" "}
        {/* End max-w-7xl */}
      </div>
    </>
  );
}
