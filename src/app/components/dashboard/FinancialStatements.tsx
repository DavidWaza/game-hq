"use client";
import {
  CaretRight,
  Eye,
  EyeClosed,
  HandWithdraw,
  Money,
  PiggyBank,
} from "@phosphor-icons/react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FinancialStatements = () => {
  const [showBalance, setShowBalance] = useState(false);
  return (
    <div className="border border-[#CBD5E1] rounded-lg p-5 lg:w-96 h-auto ml-auto bg-white shadow-sm mt-5">
      <div className="inline-flex bg-[#E5EEFD] text-[#3F61E8] py-1 px-2 rounded-lg items-center space-x-2">
        <Money
          size={20}
          weight="duotone"
          color="#3D5BFC"
          className="font-medium"
        />
        <p className="text-[#3D5BFC] font-bold whitespace-nowrap text-sm tracking-wider">
          Account Balance
        </p>
      </div>

      {/* financial statement part */}
      <div className="flex items-center py-5 gap-2">
        <p className="text-xl font-extrabold text-[#252153]">
          {showBalance ? "₦ 1,000,000" : "****"}
        </p>
        <button onClick={() => setShowBalance(!showBalance)}>
          {showBalance ? (
            <EyeClosed size={20} weight="duotone" />
          ) : (
            <Eye size={20} weight="duotone" />
          )}
        </button>
      </div>

      <Dialog>
        <DialogTrigger>
          <div className="bg-blue-700 p-2 inline-flex rounded-lg text-white text-sm font-medium items-center space-x-2 tracking-wider capitalize">
            Go to wallet
            <CaretRight size={18} />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-sm font-medium tracking-wider">
              Your Wallet Balance
            </DialogTitle>
            <div className="text-center tracking-wider">
              <span className="font-extrabold text-xl text-blue-800">
                ₦ 3,000.00
              </span>
              <div className="flex items-center justify-center my-5 gap-10">
                {/* withdraw */}
                <div className="text-center space-y-2">
                  <div className="bg-white border border-[#CBD5E1] rounded-xl flex justify-center items-center h-12 w-12 mx-auto">
                    <div className="bg-blue-800 p-2 rounded-full text-white flex items-center justify-center">
                      <HandWithdraw size={20} />
                    </div>
                  </div>
                  <p className="text-sm">Withdraw</p>
                </div>

                {/* deposit */}
                <div className="text-center space-y-2">
                  <div className="bg-white border border-[#CBD5E1] rounded-xl flex justify-center items-center h-12 w-12 mx-auto">
                    <div className="bg-blue-800 inline-flex p-2 rounded-full text-white">
                      <PiggyBank size={20} />
                    </div>
                  </div>
                  <p className="text-sm">Deposit</p>
                </div>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialStatements;
