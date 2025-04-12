"use client";
import {
  Bell,
  Globe,
  Clock,
  CurrencyNgn,
  ArrowRight,
} from "@phosphor-icons/react";
import Link from "next/link";
import React, { useState } from "react";

const Preferences = () => {
  // Mock state for preferences; replace with actual data
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [language, setLanguage] = useState("English");
  const [timeZone, setTimeZone] = useState("GMT+1 (Lagos)");
  const [betLimits, setBetLimits] = useState({
    daily: 5000,
    weekly: 20000,
    monthly: 50000,
  });

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-7 w-full">
      <h1 className="text-3xl font-extrabold text-white mb-8 flex items-center gap-2">
        <Bell size={36} className="text-orange-500" />
        Preferences
      </h1>
      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-lg p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,165,0,0.2)] transition-all duration-300 hover:scale-[1.01] items-center justify-between gap-4 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-full">
              <Bell size={32} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">
                Notification Settings
              </h2>
              <p className="text-gray-300 text-sm">
                Choose how you want to receive updates.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    email: !notifications.email,
                  })
                }
                className="accent-orange-500"
              />
              Email
            </label>
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={() =>
                  setNotifications({ ...notifications, sms: !notifications.sms })
                }
                className="accent-orange-500"
              />
              SMS
            </label>
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    push: !notifications.push,
                  })
                }
                className="accent-orange-500"
              />
              Push Notifications
            </label>
          </div>
        </div>

        {/* Language */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-lg p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,165,0,0.2)] transition-all duration-300 hover:scale-[1.01] items-center justify-between gap-4 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Globe size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">Language</h2>
                <p className="text-gray-300 text-sm">
                  Select your preferred language.
                </p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>
        </div>

        {/* Time Zone */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-lg p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,165,0,0.2)] transition-all duration-300 hover:scale-[1.01] items-center justify-between gap-4 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Clock size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">Time Zone</h2>
                <p className="text-gray-300 text-sm">
                  Set your local time zone for accurate timings.
                </p>
              </div>
            </div>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="GMT+1 (Lagos)">GMT+1 (Lagos)</option>
              <option value="GMT (London)">GMT (London)</option>
              <option value="GMT-5 (New York)">GMT-5 (New York)</option>
            </select>
          </div>
        </div>

        {/* Bet Limits */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-lg p-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,165,0,0.2)] transition-all duration-300 hover:scale-[1.01] items-center justify-between gap-4 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-full">
              <CurrencyNgn size={32} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">Bet Limits</h2>
              <p className="text-gray-300 text-sm">
                Set limits to manage responsible gambling.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-300 text-sm">Daily Limit</label>
              <div className="flex items-center gap-2">
                <CurrencyNgn size={24} className="text-orange-500" />
                <input
                  type="number"
                  value={betLimits.daily}
                  onChange={(e) =>
                    setBetLimits({
                      ...betLimits,
                      daily: Number(e.target.value),
                    })
                  }
                  className="bg-gray-700 text-[#fcf8db] rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-300 text-sm">Weekly Limit</label>
              <div className="flex items-center gap-2">
                <CurrencyNgn size={24} className="text-orange-500" />
                <input
                  type="number"
                  value={betLimits.weekly}
                  onChange={(e) =>
                    setBetLimits({
                      ...betLimits,
                      weekly: Number(e.target.value),
                    })
                  }
                  className="bg-gray-700 text-[#fcf8db] rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-300 text-sm">Monthly Limit</label>
              <div className="flex items-center gap-2">
                <CurrencyNgn size={24} className="text-orange-500" />
                <input
                  type="number"
                  value={betLimits.monthly}
                  onChange={(e) =>
                    setBetLimits({
                      ...betLimits,
                      monthly: Number(e.target.value),
                    })
                  }
                  className="bg-gray-700 text-[#fcf8db] rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
          <Link
            href="/save-limits"
            className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200 group mt-4"
          >
            <span>Save Limits</span>
            <ArrowRight
              size={18}
              className="group-hover:scale-110 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Preferences;