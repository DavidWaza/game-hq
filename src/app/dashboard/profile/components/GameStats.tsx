"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Skull,
  Crown,
  Target,
  Fire,
  Clock,
  Medal,
  Crosshair,
} from "@phosphor-icons/react";

const GameStats = () => {
  // Sample user stats - replace with real data from your API
  const [stats, setStats] = useState({
    wins: 250,
    losses: 82,
    winRatio: 0,
    killDeathRatio: 2.7,
    accuracy: 68,
    averageScore: 2145,
    highestStreak: 14,
    playTime: 342, // hours
    tournamentWins: 5,
    rankPosition: 325,
  });

  // Calculate win ratio on mount
  useEffect(() => {
    const winRatio = parseFloat(
      ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1)
    );
    setStats((prev) => ({ ...prev, winRatio }));

    // Animation for counter values
    const elements = document.querySelectorAll(".stat-value");
    elements.forEach((el) => {
      el.classList.add("animate-pulse");
      setTimeout(() => {
        el.classList.remove("animate-pulse");
      }, 1500);
    });
  }, []);

  // Custom stat card with animation
  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
    suffix?: string;
  }> = ({ icon, title, value, color, suffix = "" }) => {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#f37f2d]/20 border border-[#f37f2d]/20">
        <div className="flex items-center mb-3">
          <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
          <h3 className="ml-3 text-gray-400 text-sm">{title}</h3>
        </div>
        <div className="flex items-end">
          <span className="stat-value text-white text-2xl font-bold transition-all duration-300">
            {value}
          </span>
          {suffix && (
            <span className="text-gray-400 ml-1 text-sm">{suffix}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="transIn max-w-7xl mx-auto px-4 py-12 mt-16">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Player Statistics
      </h2>

      {/* Main stats display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Trophy size={24} className="text-yellow-500" />}
          title="Total Wins"
          value={stats.wins}
          color="bg-yellow-500/10"
        />

        <StatCard
          icon={<Skull size={24} className="text-red-500" />}
          title="Total Losses"
          value={stats.losses}
          color="bg-red-500/10"
        />

        <StatCard
          icon={<Target size={24} className="text-green-500" />}
          title="Win Ratio"
          value={stats.winRatio}
          suffix="%"
          color="bg-green-500/10"
        />

        <StatCard
          icon={<Crosshair size={24} className="text-blue-500" />}
          title="K/D Ratio"
          value={stats.killDeathRatio}
          color="bg-blue-500/10"
        />
      </div>

      {/* Secondary stats display */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          icon={<Medal size={20} className="text-purple-500" />}
          title="Avg Score"
          value={stats.averageScore}
          color="bg-purple-500/10"
        />

        <StatCard
          icon={<Fire size={20} className="text-red-500" />}
          title="Best Streak"
          value={stats.highestStreak}
          color="bg-red-500/10"
        />

        <StatCard
          icon={<Clock size={20} className="text-blue-500" />}
          title="Play Time"
          value={stats.playTime}
          suffix="hrs"
          color="bg-blue-500/10"
        />

        <StatCard
          icon={<Crown size={20} className="text-yellow-500" />}
          title="Tournaments"
          value={stats.tournamentWins}
          color="bg-yellow-500/10"
        />

        <StatCard
          icon={<Target size={20} className="text-green-500" />}
          title="Rank"
          value={`#${stats.rankPosition}`}
          color="bg-green-500/10"
        />
      </div>

      {/* Progression bar */}
      <div className="mt-12 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">Season Progress</span>
          <span className="text-white font-bold">Level 42</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#f37f2d] to-purple-600 h-full rounded-full transition-all duration-1000 animate-pulse"
            style={{ width: "78%" }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">389,240 XP</span>
          <span className="text-xs text-gray-400">500,000 XP</span>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
