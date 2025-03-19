"use client";
import React, { useState } from "react";
import Image from "next/image";
import PlaceWager from "./PlaceWager";
import JoinWager from "./JoinWager";

// Sample games data with categories
const gamesData = [
  {
    id: 1,
    title: "Call of Duty",
    img: "/assets/cod-1-poster.svg",
    nameSrc: "Call of Duty",
    nameAlt: "Call of Duty",
    category: "Action Games",
    players: 100,
    isNameImage: false,
  },
  {
    id: 2,
    title: "FIFA 25",
    img: "/assets/sport.jpg",
    nameSrc: "Fifa 25",
    nameAlt: "FIFA",
    category: "Sports Games",
    players: 120,
    isNameImage: false,
  },
  {
    id: 3,
    title: "Chess Master",
    img: "/assets/board.jpg",
    nameSrc: "Chess Master",
    nameAlt: "Chess Master",
    category: "Board Games",
    players: 85,
    isNameImage: false,
  },
  {
    id: 4,
    title: "Monopoly",
    img: "/assets/board.jpg",
    nameSrc: "Monopoly",
    nameAlt: "Monopoly",
    category: "Board Games",
    players: 95,
    isNameImage: false,
  },
  {
    id: 5,
    title: "Yahtzee",
    img: "/assets/dice-banner.jpg",
    nameSrc: "Yahtzee",
    nameAlt: "Yahtzee",
    category: "Dice Games",
    players: 60,
    isNameImage: false,
  },
  {
    id: 6,
    title: "Poker",
    img: "/assets/card.jpg",
    nameSrc: "Poker",
    nameAlt: "Poker",
    category: "Card Games",
    players: 110,
    isNameImage: false,
  },
  {
    id: 7,
    title: "Battlefield",
    img: "/assets/cod-1-poster.svg",
    nameSrc: "Battlefield",
    nameAlt: "Battlefield",
    category: "Action Games",
    players: 90,
    isNameImage: false,
  },
  {
    id: 8,
    title: "NBA 2K25",
    img: "/assets/sport.jpg",
    nameSrc: "NBA 2K25",
    nameAlt: "NBA 2K25",
    category: "Sports Games",
    players: 105,
    isNameImage: false,
  },
];

const gameCategories = [
  {
    img: "/assets/cod-1-poster.svg",
    link: "Action Games",
    label: "Action Games",
  },
  {
    img: "/assets/sport.jpg",
    link: "Sports Games",
    label: "Sports Games",
  },
  {
    img: "/assets/board.jpg",
    link: "Board Games",
    label: "Board Games",
  },
  {
    img: "/assets/dice-banner.jpg",
    link: "Dice Games",
    label: "Dice Games",
  },
  {
    img: "/assets/card.jpg",
    link: "Card Games",
    label: "Card Games",
  },
];

// Individual Game Card Component
interface Game {
  id: number;
  title: string;
  img: string;
  nameSrc: string;
  nameAlt: string;
  category: string;
  players: number;
  isNameImage: boolean;
}

const GameCard = ({ game }: { game: Game }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="space-y-3">
      <div
        className="relative cursor-pointer aspect-[16/9] w-full h-48"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full h-full relative rounded-lg overflow-hidden">
          <Image
            src={game.img}
            alt={game.nameAlt}
            fill
            className="object-cover"
          />
        </div>

        {/* Overlay that appears on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black rounded-lg bg-opacity-70 flex items-center justify-center transition-opacity duration-300">
            <h3 className="text-white text-xl font-bold text-center px-4">
              {game.nameSrc}
            </h3>
          </div>
        )}
      </div>

      {/* Wager buttons */}
      <div className="grid md:grid-cols-2 gap-3">
        <PlaceWager />
        <JoinWager />
      </div>

      
    </div>
  );
};

// Main Component
const GameCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter games based on selected category
  const filteredGames =
    selectedCategory === "All"
      ? gamesData
      : gamesData.filter((game) => game.category === selectedCategory);

  return (
    <div className="space-y-8 pb-20">
      {/* Categories Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Game Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 px-4">
          {/* Add "All" category */}
          <div
            className={`h-56 w-full whitespace-nowrap border rounded-lg p-3 relative overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 ${
              selectedCategory === "All" ? "ring-2 ring-blue-500" : ""
            }`}
            style={{
              backgroundImage: `url("/assets/all-games.jpg")`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
            onClick={() => setSelectedCategory("All")}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-40 transition-all duration-300"></div>
            <p className="absolute z-10 text-white font-bold bottom-6 left-6 capitalize text-lg">
              All Games
            </p>
          </div>

          {/* List of categories */}
          {gameCategories.map((cat, index) => (
            <div
              key={index}
              className={`h-56 w-full whitespace-nowrap border rounded-lg p-3 relative overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 ${
                selectedCategory === cat.link ? "ring-2 ring-blue-500" : ""
              }`}
              style={{
                backgroundImage: `url(${cat.img})`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
              }}
              onClick={() => setSelectedCategory(cat.link)}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-40 transition-all duration-300"></div>
              <p className="absolute z-10 text-white font-bold bottom-6 left-6 capitalize text-lg">
                {cat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Games Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {selectedCategory === "All" ? "All Games" : selectedCategory}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
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
