"use client";
import React, { useState } from "react";
import Image from "next/image";
import StatusCard from "./SetGamesCard";
// import { getFn } from "@/lib/apiClient";
import {
  TypeCategories,
  TypeGames,
  TypeSingleTournament,
} from "../../../../types/global";
import { useAuth } from "@/contexts/AuthContext";
import { formatNumber } from "@/lib/utils";

// interface TournamentRecord {
//   id: string;
//   user_id: number;
//   description: string;
//   amount: string;
//   number_of_participants: number;
//   match_time: string;
//   match_date: string;
//   created_at: string;
//   updated_at: string | null;
//   game_id: string;
//   user: {
//     id: number;
//     username: string;
//     email: string;
//     email_verified_at: string | null;
//     remember_token: string | null;
//     created_at: string | null;
//     updated_at: string | null;
//   };
//   game: Game | null;
// }

// interface Game {
//   id: string;
//   category_id: string;
//   name: string;
//   game_image: string;
//   description: string;
//   banner: string;
//   sub_banner: string[];
//   video_banner: string;
//   sub_video: string[];
//   theme_settings: string;
//   created_at: string | null;
//   updated_at: string | null;
// }


// Main Component
const GameCategories = ({
  tournaments,
}: {
  tournaments: TypeSingleTournament[];
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { store } = useAuth();

  const getCategoryById = (id: string): TypeCategories | undefined => {
    return store?.categories?.find((el) => el.id === id);
  };
  // Filter games based on selected category

  const filteredGames = (fnCategory: string): TypeSingleTournament[] => {
    if (fnCategory === "All") return tournaments;
    else
      return tournaments.filter((game: TypeSingleTournament) => {
        const findGame: TypeGames | undefined = store?.games?.find(
          (el) => el.id === game.game_id
        );
        if (findGame) {
          const findCategory: TypeCategories | undefined = getCategoryById(
            findGame?.category_id
          );
          if (findCategory && findCategory.id === fnCategory) return game;
        }
      });
  };

  return (
    <div className=" py-20">
      {/* Categories Section */}
      <div className="max-w-[600px]">
        <h2 className="text-2xl font-bold mb-4 text-[#FCF8DB]">
          Select Tournament
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Add "All" category */}

          <button
            onClick={() => setSelectedCategory("All")}
            className={`flex items-center gap-2 hover:bg-[#353736] rounded-full p-2 text-[#FCF8DB] ${
              selectedCategory === "All" ? "bg-[#353736]" : ""
            }`}
          >
            <Image
              src={"/assets/stadium-cat.png"}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="w-6 object-contain object-center"
            />
            All Games {formatNumber(tournaments?.length || 0)}
          </button>

          {/* List of categories */}
          {store?.categories?.map((cat, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 hover:bg-[#353736] rounded-full p-2 text-[#FCF8DB] ${
                selectedCategory === cat.id ? "bg-[#353736]" : ""
              }`}
            >
              <Image
                src={cat.category_image}
                alt=""
                width={0}
                height={0}
                sizes="100vw"
                className="w-5 object-contain object-center text-white"
              />
              {cat.name} Games {formatNumber(filteredGames(cat.id).length)}
            </button>
          ))}
        </div>
      </div>

      {/* Games Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-[#FCF8DB] my-10">
          {selectedCategory === "All"
            ? "All Games"
            : getCategoryById(selectedCategory)?.name + " Games"}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {filteredGames(selectedCategory).map((game) => (
            <StatusCard
              key={game.id}
              // logo={game.img}
              name={game.game.name}
              players={game.number_of_participants}
              // status={game.category}
              prize={game.amount}
              time={game.match_time}
              // borderColor={`${
              //   game.category === "Sports Games"
              //     ? "bg-[#FCF8DB]"
              //     : game.category === "Action Games"
              //     ? "bg-[#f37f2d]"
              //     : game.category === "Board Games"
              //     ? "bg-white"
              //     : game.category === "Dice Games"
              //     ? "bg-[#922b21]"
              //     : game.category === "Card Games"
              //     ? "bg-[#f1c40f]"
              //     : ""
              // }`}
            />
          ))}
        </div>

        {/* Show message when no games are available */}
        {filteredGames(selectedCategory).length === 0 ? (
          <div className="transIn text-center py-10">
            <p className="text-lg text-gray-500">
              No games available in this category
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default GameCategories;
