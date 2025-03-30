"use client";
import React, { useState } from "react";
import Image from "next/image";
import StatusCard from "./SetGamesCard";

// Sample games data with categories
const gamesData = [
  {
    id: 1,
    title: "Call of Duty",
    img: "/assets/1-3-3.png",
    nameSrc: "Call of Duty",
    nameAlt: "Call of Duty",
    category: "Action Games",
    players: 100,
    isNameImage: false,
  },
  {
    id: 2,
    title: "FIFA 25",
    img: "/assets/1-2-3.png",
    nameSrc: "Fifa 25",
    nameAlt: "FIFA",
    category: "Sports Games",
    players: 120,
    isNameImage: false,
  },
  {
    id: 3,
    title: "Chess Master",
    img: "/assets/1-4-3.png",
    nameSrc: "Chess Master",
    nameAlt: "Chess Master",
    category: "Board Games",
    players: 85,
    isNameImage: false,
  },
  {
    id: 4,
    title: "Monopoly",
    img: "/assets/1-4-3.png",
    nameSrc: "Monopoly",
    nameAlt: "Monopoly",
    category: "Board Games",
    players: 95,
    isNameImage: false,
  },
  {
    id: 5,
    title: "Yahtzee",
    img: "/assets/1-2-3.png",
    nameSrc: "Yahtzee",
    nameAlt: "Yahtzee",
    category: "Dice Games",
    players: 60,
    isNameImage: false,
  },
  {
    id: 6,
    title: "Poker",
    img: "/assets/1-4-3.png",
    nameSrc: "Poker",
    nameAlt: "Poker",
    category: "Card Games",
    players: 110,
    isNameImage: false,
  },
  {
    id: 7,
    title: "Battlefield",
    img: "/assets/1-3-3.png",
    nameSrc: "Battlefield",
    nameAlt: "Battlefield",
    category: "Action Games",
    players: 90,
    isNameImage: false,
  },
  {
    id: 8,
    title: "NBA 2K25",
    img: "/assets/1-2-3.png",
    nameSrc: "NBA 2K25",
    nameAlt: "NBA 2K25",
    category: "Sports Games",
    players: 105,
    isNameImage: false,
  },
];

const gameCategories = [
  {
    img: "/assets/cod-cat.png",
    link: "Action Games",
    label: "Action Games",
  },
  {
    img: "/assets/soccer-cat.png",
    link: "Sports Games",
    label: "Sports Games",
  },
  {
    img: "/assets/board-cat.png",
    link: "Board Games",
    label: "Board Games",
  },
  {
    img: "/assets/card-cat.png",
    link: "Card Games",
    label: "Card Games",
  },
];

// Main Component
const GameCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter games based on selected category
  const filteredGames =
    selectedCategory === "All"
      ? gamesData
      : gamesData.filter((game) => game.category === selectedCategory);

  return (
    <div className=" py-20">
      {/* Categories Section */}
      <div className="max-w-[600px]">
        <h2 className="text-2xl font-bold mb-4 text-[#FCF8DB]">
          Select Tournament
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Add "All" category */}

          <div
            onClick={() => setSelectedCategory("All")}
            className="flex items-center gap-2 hover:bg-[#353736] rounded-full p-2 text-[#FCF8DB]"
          >
            <Image
              src={"/assets/stadium-cat.png"}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="w-6 object-contain object-center"
            />
            All Games
          </div>

          {/* List of categories */}
          {gameCategories.map((cat, index) => (
            <div
              key={index}
              onClick={() => setSelectedCategory(cat.link)}
              className="flex items-center gap-2 hover:bg-[#353736] rounded-full p-2 text-[#FCF8DB]"
            >
              <Image
                src={cat.img}
                alt=""
                width={0}
                height={0}
                sizes="100vw"
                className="w-5 object-contain object-center text-white"
              />
              {cat.label}
            </div>
          ))}
        </div>
      </div>

      {/* Games Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-[#FCF8DB] my-10">
          {selectedCategory === "All" ? "All Games" : selectedCategory}
        </h2>
        <div className="grid grid-cols-1 gap-4 px-4">
          {filteredGames.map((game) => (
            <StatusCard
              key={game.id}
              logo={game.img}
              name={game.title}
              status={game.category}
              prize={5000}
              time="3pm"
              borderColor={`${
                game.category === "Sports Games"
                  ? "bg-[#FCF8DB]"
                  : game.category === "Action Games"
                  ? "bg-[#f37f2d]"
                  : game.category === "Board Games"
                  ? "bg-white"
                  : game.category === "Dice Games"
                  ? "bg-[#922b21]"
                  : game.category === "Card Games"
                  ? "bg-[#f1c40f]"
                  : ""
              }`}
            />
          ))}
        </div>

        {/* Show message when no games are available */}
        {filteredGames.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">
              No games available in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCategories;
