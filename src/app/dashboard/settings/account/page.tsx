"use client";
import { Bank, CurrencyNgn } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";

const AccountBalance = () => {
  return (
    <div className="bg-[#1a1f2e] rounded-lg p-7 inline-block">
      <h1 className="text-2xl font-bold text-white mb-6">Account Balance</h1>
      <div className="flex-wrap lg:flex items-center space-x-20">
        <div>
          <p className="text-white">Current Balance</p>
          <div className="flex items-center">
            <CurrencyNgn size={50} className="font-bold text-orange-500" />
            <h1 className="text-balance text-5xl text-[#fcf8db]">10,000.00</h1>
          </div>
        </div>

        <div>
          <p className="text-white">Bonus Balance</p>
          <div className="flex items-center">
            <CurrencyNgn size={50} className="font-bold text-orange-500" />
            <h1 className="text-balance text-5xl text-[#fcf8db]">0.00</h1>
          </div>
        </div>

        <div>
          <p className="text-white">Escrow Amount</p>
          <div className="flex items-center gap-2">
            <Bank size={50} className="font-bold text-orange-500" />
            <h1 className="text-balance text-5xl text-[#fcf8db]">
              5% <span className="text-xl">per game</span>
            </h1>
          </div>
          <Link href="#">
            <p className="text-white text-xs underline hover:scale-110 duration-200 transition-all ease-in-out">
              What is an Escrow Amount?
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountBalance;
