"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Wallet,
  ArrowDown,
  ArrowUp,
  CreditCard,
  Coins,
  CurrencyNgn,
  Bank,
} from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
// import { useRouter } from "next/navigation";
import ButtonSpinner from "@/components/ButtonSpinner";
import { getFn, postFn } from "@/lib/apiClient";
import {
  TypePaymentMethods,
  TypeTransactionsArray,
} from "../../../../types/global";
import { toast } from "sonner";
import { formatDate } from "date-fns";

export default function DigitalWallet() {
  const { user, store } = useAuth();
  const paymentMethods: TypePaymentMethods[] = store.paymentMethods || [];
  // const accountname = user?.username ?? "Game User";

  const [balance, setBalance] = useState(Number(user?.wallet?.balance || 0));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [depositStep, setDepositStep] = useState("amount");
  const [isLoading, setIsLoading] = useState("");
  const [filterType, setFilterType] = useState("all");
  // const router = useRouter();

  const [transactions, setTransactions] = useState<{
    data: TypeTransactionsArray[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  }>({
    data: [],
    total: 0,
    current_page: 1,
    last_page: 1,
    per_page: 10,
  });

  const handleProceedToPaymentMethod = () => {
    if (
      !transferAmount ||
      isNaN(Number(transferAmount)) ||
      Number(transferAmount) <= 0
    )
      return;
    setDepositStep("method");
  };

  const handlePayment = async (payment_method_id: string) => {
    const amount = Number(transferAmount);
    setIsLoading(payment_method_id);
    try {
      const response = await postFn("/api/topup", {
        amount,
        payment_method_id,
      });
      if (response) {
        toast.success("Payment initiated successfully");
        if (response?.data?.payment_url) {
          window.location.href = response?.data?.payment_url;
        }
      }
    } catch {
      setIsLoading("");
    } finally {
    }
  };

  const closeDepositModal = () => {
    setShowDepositModal(false);
    setTransferAmount("");
    setDepositStep("amount");
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
    setTransferAmount("");
    setShowWithdrawModal(false);
  };

  const getTransactions = useCallback(async (page: number = 1) => {
    try {
      const response = await getFn(`/api/transactions?limit=10&page=${page}`);
      const responseTransData = {
        data: response.data.data,
        total: response.data.total,
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
      };
      setTransactions(responseTransData);
    } catch {}
  }, []);

  // get transactions
  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  return (
    <>
      <Navbar variant="primary" />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 md:p-8 text-white !pt-52">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Wallet size={32} className="text-teal-400 mr-3" />
              <h1 className="text-2xl md:text-3xl font-bold">Digital Wallet</h1>
            </div>
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1"></div>
          </div>

          <div className="transIn grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <p className="text-gray-300 text-sm font-medium mb-2">
                Current Balance
              </p>
              <div className="flex items-center">
                <Coins size={28} className="text-teal-400" />
                <h2 className="text-3xl font-bold text-white ml-3 flex items-center">
                  {formatCurrency(Number(user?.wallet?.balance || 0))}
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
          </div>
          {activeTab === "dashboard" && (
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
                {transactions.data.map((transaction: TypeTransactionsArray) => (
                  <div
                    key={transaction.id}
                    className="transIn flex items-center justify-between p-4 border-b border-gray-700 last:border-0 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.transaction_type.name === "topup" ||
                          transaction.transaction_type.name ===
                            "transfer from savings"
                            ? "bg-green-500/20"
                            : transaction.transaction_type.name ===
                                "withdraw" ||
                              transaction.transaction_type.name ===
                                "transfer to savings"
                            ? "bg-red-500/20"
                            : transaction.transaction_type.name === "payment"
                            ? "bg-yellow-500/20"
                            : "bg-blue-500/20"
                        }`}
                      >
                        {(transaction.transaction_type.name === "topup" ||
                          transaction.transaction_type.name ===
                            "transfer from savings") && (
                          <ArrowDown size={20} className="text-green-400" />
                        )}
                        {(transaction.transaction_type.name === "withdraw" ||
                          transaction.transaction_type.name ===
                            "transfer to savings") && (
                          <ArrowUp size={20} className="text-red-400" />
                        )}
                        {transaction.transaction_type.name === "payment" && (
                          <CreditCard size={20} className="text-yellow-400" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium capitalize">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(
                            transaction.transaction_type.created_at,
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-medium flex items-center ${
                        transaction.transaction_type.name === "topup" ||
                        transaction.transaction_type.name ===
                          "transfer from savings"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.transaction_type.name === "topup" ||
                      transaction.transaction_type.name ===
                        "transfer from savings"
                        ? "+"
                        : "-"}
                      {formatCurrency(Number(transaction.amount))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                    {transactions.data.map(
                      (transaction: TypeTransactionsArray) => (
                        <tr
                          key={transaction.id + 21321212}
                          className="border-b border-gray-700 last:border-0 hover:bg-gray-700/20"
                        >
                          <td className="py-4 pl-2 flex items-center">
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${
                                  transaction.transaction_type.name ===
                                    "topup" ||
                                  transaction.transaction_type.name ===
                                    "transfer from savings"
                                    ? "bg-green-500/20"
                                    : transaction.transaction_type.name ===
                                        "withdraw" ||
                                      transaction.transaction_type.name ===
                                        "transfer to savings"
                                    ? "bg-red-500/20"
                                    : transaction.transaction_type.name ===
                                      "payment"
                                    ? "bg-yellow-500/20"
                                    : "bg-blue-500/20"
                                }`}
                              >
                                {(transaction.transaction_type.name ===
                                  "topup" ||
                                  transaction.transaction_type.name ===
                                    "transfer from savings") && (
                                  <ArrowDown
                                    size={16}
                                    className="text-green-400"
                                  />
                                )}
                                {(transaction.transaction_type.name ===
                                  "withdraw" ||
                                  transaction.transaction_type.name ===
                                    "transfer to savings") && (
                                  <ArrowUp size={16} className="text-red-400" />
                                )}
                                {transaction.transaction_type.name ===
                                  "payment" && (
                                  <CreditCard
                                    size={16}
                                    className="text-yellow-400"
                                  />
                                )}
                              </div>
                              <span className="capitalize text-sm">
                                {transaction.transaction_type.name}
                              </span>
                            </div>
                          </td>
                          <td className="text-sm">
                            {formatDate(
                              transaction.transaction_type.created_at,
                              "MMM d, yyyy"
                            )}
                          </td>
                          <td
                            className={`text-sm flex items-center ${
                              transaction.transaction_type.name === "topup" ||
                              transaction.transaction_type.name ===
                                "transfer from savings"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {transaction.transaction_type.name === "topup" ||
                            transaction.transaction_type.name ===
                              "transfer from savings"
                              ? "+"
                              : "-"}
                            {formatCurrency(Number(transaction.amount))}
                          </td>
                          <td className="pr-2">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs capitalize ${
                                transaction.status === "completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
              {depositStep === "amount" && (
                <>
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
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={closeDepositModal}
                      className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProceedToPaymentMethod}
                      disabled={!transferAmount || Number(transferAmount) <= 0}
                      className="flex-1 py-2 px-4 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Proceed
                    </button>
                  </div>
                </>
              )}

              {depositStep === "method" && (
                <>
                  <h3 className="text-xl font-semibold mb-6 text-white text-center">
                    Select Payment Method
                  </h3>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <button
                        disabled={isLoading !== ""}
                        key={method.id}
                        onClick={() => {
                          handlePayment(method.id);
                        }}
                        className="w-full flex items-center justify-center py-3 px-4 rounded-lg border border-gray-600 hover:border-teal-500 hover:bg-gray-700 transition-all"
                      >
                        {isLoading === method.id ? (
                          <ButtonSpinner color="#fff" />
                        ) : (
                          <>
                            {method.name !== "bank_transfer" ? (
                              <CreditCard
                                size={20}
                                className="mr-3 text-teal-400"
                              />
                            ) : (
                              <Bank size={20} className="mr-3 text-teal-400" />
                            )}
                            {method.display_name}
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={isLoading !== ""}
                    onClick={() => setDepositStep("amount")}
                    className="mt-6 w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                  >
                    Back
                  </button>
                </>
              )}

              {depositStep === "transferDetails" && (
                <>
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    Bank Transfer Details
                  </h3>
                  <div className="bg-gray-700/50 rounded-lg p-4 space-y-3 text-sm">
                    <p className="text-center text-gray-300">
                      Please transfer{" "}
                      <span className="font-bold text-teal-400">
                        {formatCurrency(Number(transferAmount))}
                      </span>{" "}
                      to any of the following accounts:
                    </p>
                    <div>
                      <p className="font-bold">Wema Bank</p>
                      <p>Account Number: 1234567890</p>
                      <p>Account Name: Your App Name</p>
                    </div>
                    <hr className="border-gray-600" />
                    <div>
                      <p className="font-bold">GTBank</p>
                      <p>Account Number: 0987654321</p>
                      <p>Account Name: Your App Name</p>
                    </div>
                  </div>
                  <p className="text-xs text-center text-red-400 mt-4">
                    Note: Your wallet will be credited automatically upon
                    confirmation.
                  </p>
                  <button
                    onClick={closeDepositModal}
                    className="mt-6 w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors text-white"
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
        )}
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
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2 flex items-center">
                  Available balance: {formatCurrency(balance)}
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
                  className="flex-1 py-2 px-4 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
