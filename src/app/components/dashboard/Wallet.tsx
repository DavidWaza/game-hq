import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
// import { CurrencyNgn } from "@phosphor-icons/react";
import { formatCurrency } from "@/lib/utils";

const Wallet = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  // const [transactionType, setTransactionType] = useState("deposit");
  // const [amount, setAmount] = useState("");
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !(modalRef.current as HTMLElement).contains(event.target as Node)
      ) {
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

  return (
    <div className="relative w-full sm:w-auto">
      {/* Wallet Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex justify-center sm:justify-start p-2 sm:p-0"
      >
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Avatar */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#233d4d] border-2 border-[#f37f2d] flex items-center justify-center overflow-hidden">
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
                {user?.username}
              </p>
              <p className="text-sm sm:text-base md:text-lg flex items-center gap-1">
                <span className="text-[#f37f2d]">✧</span>
                {/* <CurrencyNgn size={20} /> */}
                {formatCurrency(Number(user?.wallet?.balance || 0))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
