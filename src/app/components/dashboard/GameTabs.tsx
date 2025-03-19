"use client";
import React, { useState } from "react";
import Image from "next/image";

// import { UsersFour } from "@phosphor-icons/react";
import PlaceWager from "./PlaceWager";
import JoinWager from "./JoinWager";

const games = [
  {
    src: "/assets/cod-2-poster.svg",
    nameSrc: "/assets/cod-name.svg",
    nameAlt: "Call of Duty",
    players: 100,
    isNameImage: true,
  },
  {
    src: "/assets/fifa-poster.svg",
    nameSrc: "/assets/fifa-name.svg",
    nameAlt: "FIFA",
    players: 120,
    isNameImage: true,
  },
  {
    src: "/assets/mk-poster.svg",
    nameSrc: "/assets/mk-name.svg",
    nameAlt: "Mortal Kombat",
    players: 90,
    isNameImage: true,
  },
  {
    src: "/assets/e-football-poster.svg",
    nameSrc: "/assets/e-football-name.svg",
    nameAlt: "eFootball",
    players: 90,
    isNameImage: true,
  },
  {
    src: "/assets/nfs-poster.svg",
    nameSrc: "/assets/nfs-name.svg",
    nameAlt: "Need for Speed",
    players: 90,
    isNameImage: true,
  },
];

const GameTabs = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>

      <div className="my-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {games.map((game, index) => (
            <div key={index}>
              <div
                className="relative cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Image
                  src={game.src}
                  alt={game.nameAlt}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto object-center object-contain"
                />

                {/* Overlay that appears on hover */}
                {hoveredIndex === index && (
                  <div className="absolute inset-0 bg-black rounded-lg bg-opacity-70 flex items-center justify-center transition-opacity duration-300">
                    {game.isNameImage ? (
                      <Image
                        src={game.nameSrc}
                        alt={game.nameAlt}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-3/4 h-auto object-center object-contain "
                      />
                    ) : (
                      <h3 className="text-white text-xl font-bold text-center px-4">
                        {game.nameSrc}
                      </h3>
                    )}
                  </div>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <PlaceWager />
                <JoinWager />
              </div>
              <div className="flex items-center mt-3 space-x-3">
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <div className="absolute inset-0 w-full h-full rounded-full bg-red-500 animate-ping opacity-75"></div>
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                </div>

                <p className="text-gray-500 font-medium text-sm">
                  {game.players} Players found
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GameTabs;
