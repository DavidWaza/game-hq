"use client";
import { Gift, Info, Users, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";

const PromotionsAndBonuses = () => {
  // Sample data for active bonuses; replace with actual data
  const activeBonuses = [
    {
      id: 1,
      title: "Welcome Bonus",
      amount: 2000,
      expiry: "2025-04-15",
      status: "Active",
    },
    {
      id: 2,
      title: "Weekend Cashback",
      amount: 500,
      expiry: "2025-04-10",
      status: "Pending",
    },
  ];

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-7 w-full">
      <h1 className="text-3xl font-extrabold text-white mb-8 flex items-center gap-2">
        <Gift size={36} className="text-orange-500" />
        Promotions and Bonuses
      </h1>
      <div className="space-y-6">
        {/* Active Bonuses */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-lg p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,165,0,0.2)] transition-all duration-300 hover:scale-[1.01] items-center justify-between gap-4 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-full">
              <Gift size={32} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">
                Active Bonuses
              </h2>
              <p className="text-gray-300 text-sm">
                View ongoing promotions tied to your account.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {activeBonuses.length === 0 ? (
              <p className="text-gray-300 text-center py-4">
                No active bonuses at the moment. Check back soon!
              </p>
            ) : (
              activeBonuses.map((bonus) => (
                <div
                  key={bonus.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-[#2a3147] rounded-md"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-white font-semibold">{bonus.title}</p>
                      <p className="text-gray-300 text-sm">
                        Expires: {bonus.expiry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[#fcf8db] text-xl font-bold">
                      ₦{bonus.amount.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        bonus.status === "Active"
                          ? "text-[#fcf8db]"
                          : "text-gray-400"
                      }`}
                    >
                      {bonus.status}
                    </p>
                    <Link
                      href={`/bonus-details/${bonus.id}`}
                      className="text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bonus Terms */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-lg p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,165,0,0.2)] transition-all duration-300 hover:scale-[1.01] items-center justify-between gap-4 backdrop-blur-sm hover:scale-[1.02]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Info size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">
                  Bonus Terms
                </h2>
                <p className="text-gray-300 text-sm">
                  Understand wagering requirements and eligibility.
                </p>
              </div>
            </div>
            <Link
              href="/bonus-terms"
              className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200 group"
            >
              <span>Full Terms</span>
              <ArrowRight
                size={18}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </Link>
          </div>
          <ul className="mt-4 text-gray-300 text-sm list-disc list-inside">
            <li>Wagering Requirement: 10x bonus amount</li>
            <li>Expiry: Bonuses valid for 30 days unless specified</li>
            <li>Eligible Games: Slots, Sports Betting (min odds 1.5)</li>
          </ul>
        </div>

        {/* Referral Program */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-lg p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,165,0,0.2)] transition-all duration-300 hover:scale-[1.01] items-center justify-between gap-4 backdrop-blur-sm hover:scale-[1.02]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Users size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">
                  Referral Program
                </h2>
                <p className="text-gray-300 text-sm">
                  Invite friends and earn rewards!
                </p>
              </div>
            </div>
            <Link
              href="/referral-program"
              className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200 group"
            >
              <span>Get Referral Link</span>
              <ArrowRight
                size={18}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </Link>
          </div>
          <div className="mt-4 text-gray-300 text-sm">
            <p>
              Earn ₦500 for every friend who signs up and deposits using your
              referral link. No limits on referrals!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionsAndBonuses;
