
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const Wallet = () => {
  const [balance, setBalance] = useState(1000);
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("deposit");
  const [amount, setAmount] = useState("");
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !(modalRef.current as HTMLElement).contains(event.target as Node)) {
      setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
    <div className="relative w-full sm:w-auto">
      {/* Wallet Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex justify-center sm:justify-start p-2 sm:p-0"
      >
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Avatar */}
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#233d4d] border-2 border-[#f37f2d] 
                       flex items-center justify-center overflow-hidden"
          >
            <Image
              width={0}
              height={0}
              src="/assets/mk-av.svg"
              alt="Player Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Balance */}
          <div className="text-[#fcf8db] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm text-[#f37f2d] font-medium">
                David Waza
              </p>
              <p className="text-sm sm:text-base md:text-lg flex items-center gap-1">
                <span className="text-[#f37f2d]">✧</span>
                {balance} CP
              </p>
            </div>
           
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      {isOpen && (
        <div
          ref={modalRef}
          className="absolute top-full hidden md:block mt-2 left-0 right-0 sm:right-auto mx-auto sm:mx-0 w-full sm:w-72 bg-[#233d4d] 
                     p-3 sm:p-4 rounded-lg border-2 sm:border-4 border-[#f37f2d] shadow-2xl 
                     z-50 animate-fadeIn"
        >
          <h3 className="text-base sm:text-lg text-[#fcf8db] mb-3 sm:mb-4 text-center font-bold">
            Magic Transaction
          </h3>

          {/* Transaction Type Toggle */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <button
              onClick={() => setTransactionType("deposit")}
              className={`px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm ${
                transactionType === "deposit"
                  ? "bg-[#f37f2d] border-[#fcf8db] text-[#233d4d]"
                  : "bg-[#fcf8db] border-[#f37f2d] text-[#233d4d]"
              } hover:bg-[#f37f2d] hover:text-[#fcf8db] transition-colors`}
            >
              Deposit
            </button>
            <button
              onClick={() => setTransactionType("withdraw")}
              className={`px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm ${
                transactionType === "withdraw"
                  ? "bg-[#f37f2d] border-[#fcf8db] text-[#233d4d]"
                  : "bg-[#fcf8db] border-[#f37f2d] text-[#233d4d]"
              } hover:bg-[#f37f2d] hover:text-[#fcf8db] transition-colors`}
            >
              Withdraw
            </button>
          </div>

          {/* Amount Input */}
          <div className="mb-3 sm:mb-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-[#fcf8db] border-2 border-[#f37f2d] rounded p-1 sm:p-2 
                        text-[#233d4d] text-sm placeholder-[#233d4d] focus:outline-none 
                        focus:border-[#f37f2d]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-2">
            <button
              onClick={handleTransaction}
              className="bg-[#f37f2d] hover:bg-[#fcf8db] text-[#233d4d] px-2 sm:px-4 py-1 sm:py-2 
                        rounded border-2 border-[#233d4d] transition-colors text-sm font-medium flex-1"
            >
              Confirm
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-[#fcf8db] hover:bg-[#f37f2d] text-[#233d4d] px-2 sm:px-4 py-1 sm:py-2 
                        rounded border-2 border-[#233d4d] transition-colors text-sm font-medium flex-1"
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
