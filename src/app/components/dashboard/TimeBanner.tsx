"use client";
import { useState } from "react";
import { Bungee } from "next/font/google";
import Image from "next/image";
import React from "react";
import CountdownTimer from "./CountdownTimer";
import Button from "../Button";
import { motion } from "framer-motion";
import { CurrencyNgn } from "@phosphor-icons/react";
import Modal from "./Modal";

const bungee = Bungee({
  variable: "--bungee",
  display: "swap",
  subsets: ["latin"],
  weight: "400",
});

const TimeBanner = () => {
  const [isOpenTournament, setIsOpenTournament] = useState(false);

  const scrollToSection = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <div className="time-banner relative overflow-hidden">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-80 z-10"></div>

      {/* Content */}
      <div className="relative z-30 text-[#FCF8DB] flex flex-col items-center justify-center h-full text-center">
        <h1 className={`${bungee.className} text-2xl font-bold uppercase`}>
          next tournament
        </h1>
        <h1 className="text-7xl uppercase py-2">Call of Duty</h1>
        <p className="uppercase text-2xl pb-2">
          <span className="text-[#f37f2d]">5</span> Participants left
        </p>
        <div className="flex items-center">
          <CurrencyNgn
            size={20}
            weight="duotone"
            color="#f37f2d"
            className="font-bold"
          />
          <p className="text-[#FCF8DB] text-lg">20,000</p>
        </div>
        <CountdownTimer />
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
          content=""
          firstButtonText="Accept"
          secondButtonText="Reject"
          onClick={() => (window.location.href = "/dashboard/create-wager")}
        />
      </div>

      {/* Bottom Images */}
      <div className="hidden absolute bottom-0 left-0 w-full lg:flex justify-between items-end px-4 z-20">
        <Image
          src={"/assets/soap.png"}
          alt="Soap"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full max-w-[450px] h-auto object-cover"
        />
        <Image
          src={"/assets/register-duty.png"}
          alt="Countdown"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full max-w-[430px] h-auto object-cover"
        />
      </div>
      <motion.div
        className="absolute z-30 left-[45%] bottom-10 -translate-x-1/2"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <button
          onClick={scrollToSection}
          className="flex flex-col items-center text-white text-center px-4 py-2 rounded-lg"
        >
          <Image
            src={"/assets/cod-icon.svg"}
            alt="Countdown"
            width={0}
            height={0}
            sizes="100vw"
            className="w-[70%] max-w-[430px] mx-auto h-auto object-cover"
          />
          <p className="mt-2">Scroll Down</p>
        </button>
      </motion.div>
    </div>
  );
};

export default TimeBanner;
