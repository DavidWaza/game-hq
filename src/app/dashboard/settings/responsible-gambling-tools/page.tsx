"use client";
import {
  Shield,
  Clock,
  PiggyBank,
  PauseCircle,
  ArrowRight,
  Info,
} from "@phosphor-icons/react";
import Link from "next/link";
import React, { useState } from "react";

const ResponsibleGamblingTools = () => {
  // Mock state for tools; replace with actual data
  const [realityCheck, setRealityCheck] = useState({ enabled: false, interval: 60 });
  const [depositLimit, setDepositLimit] = useState(10000);
  const [coolOff, setCoolOff] = useState({ active: false, days: 0 });

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-7 w-full">
      <h1 className="text-3xl font-extrabold text-white mb-8 flex items-center gap-2">
        <Shield size={36} className="text-orange-500" />
        Responsible Gambling Tools
      </h1>
      <div className="space-y-6">
        {/* Reality Check */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Clock size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">Reality Check</h2>
                <p className="text-gray-300 text-sm">
                  Get periodic reminders of your playtime and spending.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={realityCheck.interval}
                onChange={(e) =>
                  setRealityCheck({ ...realityCheck, interval: Number(e.target.value) })
                }
                disabled={!realityCheck.enabled}
                className="bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value={15}>15 mins</option>
                <option value={30}>30 mins</option>
                <option value={60}>60 mins</option>
                <option value={120}>2 hours</option>
              </select>
              <button
                onClick={() =>
                  setRealityCheck({ ...realityCheck, enabled: !realityCheck.enabled })
                }
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  realityCheck.enabled
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-600 text-white hover:bg-gray-500"
                }`}
              >
                {realityCheck.enabled ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        </div>

        {/* Deposit Ceiling */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <PiggyBank size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">Deposit Ceiling</h2>
                <p className="text-gray-300 text-sm">
                  Set a cap on your deposits to stay in control.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#fcf8db] text-xl font-bold">₦</span>
              <input
                type="number"
                value={depositLimit}
                onChange={(e) => setDepositLimit(Number(e.target.value))}
                className="bg-gray-700 text-[#fcf8db] rounded-md px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Link
                href="/save-deposit-limit"
                className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200 group"
              >
                <span>Save</span>
                <ArrowRight
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
              </Link>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            *Updates take effect after 24-hour cooling-off period.
          </p>
        </div>

        {/* Cool-Off Countdown */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <PauseCircle size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">Cool-Off Countdown</h2>
                <p className="text-gray-300 text-sm">
                  Take a break with a personalized timeout period.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={coolOff.days}
                onChange={(e) =>
                  setCoolOff({ ...coolOff, days: Number(e.target.value) })
                }
                disabled={coolOff.active}
                className="bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value={1}>1 Day</option>
                <option value={7}>1 Week</option>
                <option value={30}>1 Month</option>
                <option value={90}>3 Months</option>
              </select>
              <button
                onClick={() => setCoolOff({ ...coolOff, active: !coolOff.active })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  coolOff.active
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-600 text-white hover:bg-gray-500"
                }`}
              >
                {coolOff.active ? "End Break" : "Start Break"}
              </button>
            </div>
          </div>
          {coolOff.active && (
            <p className="text-[#fcf8db] text-sm mt-2">
              Break active: {coolOff.days} days remaining.
            </p>
          )}
        </div>

        {/* Gambling Health Quiz */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Info size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">Gambling Health Quiz</h2>
                <p className="text-gray-300 text-sm">
                  Take a quick self-assessment to monitor your habits.
                </p>
              </div>
            </div>
            <Link
              href="/gambling-health-quiz"
              className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200 group"
            >
              <span>Take Quiz</span>
              <ArrowRight
                size={18}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </Link>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            *Confidential and takes less than 2 minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResponsibleGamblingTools;