import { Bungee } from "next/font/google";
import Image from "next/image";
import React from "react";
import CountdownTimer from "./CountdownTimer";
import Button from "../Button";

const bungee = Bungee({
  variable: "--bungee",
  display: "swap",
  subsets: ["latin"],
  weight: "400",
});

const TimeBanner = () => {
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
        <p className="uppercase text-2xl pb-2">21 April, 2025 - 8:00pm</p>
        <CountdownTimer />
        <div className="w-56 my-10">
          <Button>Join tournament</Button>
        </div>
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
    </div>
  );
};

export default TimeBanner;
