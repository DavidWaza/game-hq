"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/effect-fade";
import { EnvelopeSimple, GameController, Trophy } from "@phosphor-icons/react";
import { useState } from "react";
import Modal from "./Modal";

const slides = [
  { image: "/assets/board.jpg", name: "Roll the dice ", link: "/page1" },
  { image: "/assets/card.jpg", name: "Card Games", link: "/page2" },
  {
    image: "/assets/cod-3.jpg",
    name: "we won't be firing any warning shots",
    link: "/page3",
  },
];

const Carousel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenInvite, setIsOpenInvite] = useState(false);

  return (
    <div className="relative min-h-screen">
      <div className="absolute z-20 bottom-10 md:bottom-20 bg-cover bg-center w-full">
        <div className="flex flex-col items-center md:items-end gap-2 md:gap-4 px-5 space-y-5 md:ml-auto md:mr-20">
          {/* Create Wager */}
          <button
            onClick={() => (setIsOpenInvite(false), setIsOpen(true))}
            className="button min-w-80 bg-[#233d4d] text-[#fcf8db] p-3 text-center items-center group hover:bg-[#f37f2d] transition-all duration-300 ease-in-out border-2 border-[#f37f2d] rounded-lg"
          >
            <div className="flex justify-center items-center gap-2">
              <GameController
                size={32}
                className="text-[#FCF8DB] group-hover:text-[#233d4d] transition-all duration-300 ease-in-out group-hover:animate-bounce"
              />
              <p className="text-sm md:text-lg font-bold mt-1 uppercase group-hover:text-[#233d4d]">
                Create Wager
              </p>
            </div>
            <div className="button__horizontal"></div>
            <div className="button__vertical"></div>
          </button>

          {/* Open create wager modal */}
          <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            header="Select Game Mode"
            sub="Choose how you want to play"
            firstButtonText="Create Tournament"
            secondButtonText="Create One-on-One"
            onClick={() => window.location.href='/dashboard/create-tournament'}
            onTab={() => window.location.href='/dashboard/create-one-v-one'}
          />

          {/* My Invitations */}
          <div
            onClick={() => (setIsOpenInvite(true), setIsOpen(false))}
            className="button bg-[#233d4d] min-w-80 text-[#f37f2d] p-3 text-center items-center group hover:bg-[#f37f2d]  transition-all duration-300 ease-in-out border-2 border-[#f37f2d] rounded-lg"
          >
            <div className="flex justify-center gap-2">
              {/* <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-[#f37f2d] absolute -right-2 -top-1 group-hover:animate-bounce">
                  3
                </div> */}
              <EnvelopeSimple
                size={32}
                className="text-[#f37f2d] group-hover:text-[#233d4d] transition-all duration-300 ease-in-out"
              />
              <p className="text-sm md:text-lg font-bold mt-1 uppercase text-[#f37f2d] group-hover:text-[#233d4d] ">
                My Invitations
              </p>
            </div>
            <div className="button__horizontal"></div>
            <div className="button__vertical"></div>
          </div>

          <Modal
            isOpen={isOpenInvite}
            setIsOpen={setIsOpenInvite}
            header=" Join Game Mode"
            sub="You have been selected"
            firstButtonText="Join Tournament"
            secondButtonText="Join One-on-One"
            onClick={() => (window.location.href = "/dashboard/join-tournament")}
          />

          {/* My History */}
          <Link href="" className="min-w-80">
            <div className="button bg-[#233d4d] text-[#fcf8db] text-center items-center group hover:bg-[#f37f2d] transition-all duration-300 ease-in-out border-2 border-[#f37f2d] rounded-lg">
              <div className=" text-center p-3 items-center group border-[#233d4d] rounded-lg hover:bg-opacity-100 transition-all duration-300 ease-in-out">
                <div className="flex justify-center gap-2">
                  <Trophy
                    size={32}
                    className="text-[#FCF8DB] group-hover:text-[#233d4d] transition-all duration-300 ease-in-out group-hover:animate-bounce"
                  />
                  <p className="text-sm md:text-lg font-bold mt-1 uppercase group-hover:text-[#233d4d]">
                    my games
                  </p>
                </div>
              </div>
              <div className="button__horizontal"></div>
              <div className="button__vertical"></div>
            </div>
          </Link>
        </div>
      </div>

      {/* Swiper Container */}
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        className="w-full h-screen sm:h-screen"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-screen sm:h-screen">
              {/* Background Image */}
              <Image
                src={slide.image}
                fill
                alt={slide.name}
                className="w-full h-full object-cover object-center"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              />

              {/* Overlay with Animations */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 px-4 text-center">
                {/* Animated Title - Changes per Slide */}
                <motion.h2
                  key={slide.name}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 1 }}
                  className="text-[#fcf8db] text-2xl sm:text-4xl md:text-6xl mb-4 font-bold uppercase"
                >
                  {slide.name}
                </motion.h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
