import Image from "next/image";
import React, { useState } from "react";

const Wallet = () => {
  const [balance, setBalance] = useState(1000);
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("deposit");
  const [amount, setAmount] = useState("");

  const handleTransaction = () => {
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount <= 0) return;

    if (transactionType === "deposit") {
      setBalance(balance + numAmount);
    } else if (transactionType === "withdraw" && numAmount <= balance) {
      setBalance(balance - numAmount);
    }
    setAmount("");
    setIsOpen(false);
  };

  return (
    <div className="relative font-['Press_Start_2P']">
      {/* Wallet Button */}
      <div onClick={() => setIsOpen(!isOpen)} className="">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full bg-[#233d4d] border-2 border-[#f37f2d] 
                         flex items-center justify-center overflow-hidden"
          >
            <Image
              width={0}
              height={0}
              src="/assets/cod-av.png"
              alt="Player Avatar"
              className="w-full h-full"
            />
          </div>

          {/* Balance */}
          <div className="text-[#233d4d]">
            <p className="text-sm text-[#f37f2d]">Coin Purse</p>
            <p className="text-lg flex items-center gap-1">
              <span className="text-[#f37f2d]">✧</span>
              {balance}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      {isOpen && (
        <div
          className="absolute top-20 left-0 right-0 mx-auto w-72 bg-[#233d4d] 
                       p-4 rounded-lg border-4 border-[#f37f2d] shadow-2xl 
                       z-10 animate-fadeIn"
        >
          <h3 className="text-lg text-[#fcf8db] mb-4 text-center">
            Magic Transaction
          </h3>

          {/* Transaction Type Toggle */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setTransactionType("deposit")}
              className={`px-3 py-1 rounded-full border-2 text-sm ${
                transactionType === "deposit"
                  ? "bg-[#f37f2d] border-[#fcf8db] text-[#233d4d]"
                  : "bg-[#fcf8db] border-[#f37f2d] text-[#233d4d]"
              } hover:bg-[#f37f2d] hover:text-[#fcf8db] transition-colors`}
            >
              Deposit
            </button>
            <button
              onClick={() => setTransactionType("withdraw")}
              className={`px-3 py-1 rounded-full border-2 text-sm ${
                transactionType === "withdraw"
                  ? "bg-[#f37f2d] border-[#fcf8db] text-[#233d4d]"
                  : "bg-[#fcf8db] border-[#f37f2d] text-[#233d4d]"
              } hover:bg-[#f37f2d] hover:text-[#fcf8db] transition-colors`}
            >
              Withdraw
            </button>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-[#fcf8db] border-2 border-[#f37f2d] rounded p-2 
                        text-[#233d4d] placeholder-[#233d4d] focus:outline-none 
                        focus:border-[#f37f2d]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleTransaction}
              className="bg-[#f37f2d] hover:bg-[#fcf8db] text-[#233d4d] px-4 py-2 
                        rounded border-2 border-[#233d4d] transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-[#fcf8db] hover:bg-[#f37f2d] text-[#233d4d] px-4 py-2 
                        rounded border-2 border-[#233d4d] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Wallet;
