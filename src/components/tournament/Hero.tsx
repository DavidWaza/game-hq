"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import CountdownTimer from "@/components/CountdownTimer";
import Button from "@/components/Button";
import { motion } from "framer-motion";
import Modal from "@/app/components/dashboard/Modal";
import { TypeGames, TypeSingleTournament } from "../../../types/global";
import { formatCurrency, formatNumber } from "@/lib/utils";

type TypePropsComponent = {
  game: TypeGames | undefined;
  tournamentDetails: TypeSingleTournament | undefined;
};

const TimeBanner = ({ game, tournamentDetails }: TypePropsComponent) => {
  const [isOpenTournament, setIsOpenTournament] = useState(false);
  const [theme, setTheme] = useState({
    mouse_pointer: "/assets/cod-icon.svg",
  });

  const scrollToSection = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };
  useEffect(() => {
    if (game?.theme_settings) {
      const gameTheme = JSON.parse(`${game?.theme_settings}`);
      setTheme(gameTheme);
    }
  }, [game?.theme_settings]);

  return (
    <div
      style={{
        backgroundImage: `url(${game?.game_image})`,
      }}
      className="time-banner relative overflow-hidden"
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-80 z-10"></div>

      {/* Content */}
      <div className="relative z-30 text-[#FCF8DB] flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-7xl uppercase py-2">{game?.name} tournament</h1>
        <p className="uppercase text-2xl pb-2">
          <span className="text-[#f37f2d]">
            {formatNumber(tournamentDetails?.number_of_participants || 0)}
          </span>{" "}
          Participants left
        </p>
        <div className="flex items-center">
          {/* <CurrencyNgn
            size={20}
            weight="duotone"
            color="#f37f2d"
            className="font-bold"
          /> */}
          <p className="text-[#FCF8DB] text-lg">
            {formatCurrency(tournamentDetails?.amount || 0)}
          </p>
        </div>
        <CountdownTimer
          targetDate={
            new Date(
              `${tournamentDetails?.match_date}T${tournamentDetails?.match_time}`
            )
          }
        />
        <div className="w-56 my-10">
          <Button onClick={() => setIsOpenTournament(true)}>
            Join tournament
          </Button>
        </div>
      </div>
      <div className="absolute z-50">
        <Modal
          isOpen={isOpenTournament}
          setIsOpen={setIsOpenTournament}
          header="GAME RULES"
          contentTitle={game?.name + " Tournament Rules"}
          contentItems={[tournamentDetails?.description || ""]}
          firstButtonText="Accept"
          secondButtonText="Reject"
          onClick={() =>
            (window.location.href = `/dashboard/tournament-lobby/${game?.id}`)
          }
        />
      </div>

      {/* Bottom Images */}
      <div className="hidden absolute bottom-0 left-0 w-full lg:flex justify-between items-end px-4 z-20">
        {game?.sub_banner?.map((el: string, index: number) => {
          return (
            <Image
              key={el + index + 21231}
              src={el || "/assets/soap.png"}
              alt="Soap"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full max-w-[450px] h-auto object-cover"
            />
          );
        })}
      </div>

      {/* Scroll Down Button - Centered and Responsive */}
      <motion.div
        className="absolute z-30 bottom-8 w-full flex justify-center"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <button
          onClick={scrollToSection}
          className="flex flex-col items-center text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f37f2d] hover:bg-[#f37f2d]/20 transition-colors"
          aria-label="Scroll to next section"
        >
          <Image
            src={theme?.mouse_pointer}
            alt="Scroll down icon"
            width={0}
            height={0}
            sizes="(max-width: 640px) 50px, 60px"
            className="w-[50px] sm:w-[60px] h-auto object-cover"
          />
          <p className="mt-2 text-sm sm:text-base">Scroll Down</p>
        </button>
      </motion.div>
    </div>
  );
};

export default TimeBanner;
