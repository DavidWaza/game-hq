"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/effect-fade";
import { EnvelopeSimple, GameController, Trophy } from "@phosphor-icons/react";
import { useState } from "react";
import Modal from "./Modal";

const slides = [
  { image: "/assets/board.jpg", name: "Roll the dice ", link: "/page1" },
  {
    image: "/assets/card.jpg",
    name: "One Ace, Two Kings, Three Queens, Four Jacks, Five Tens. Royal flush!",
    link: "/page2",
  },
  {
    image: "/assets/cod-3.jpg",
    name: "we won't be firing any warning shots",
    link: "/page3",
  },
];

const Carousel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenInvite, setIsOpenInvite] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative w-full h-dvh">
      <div className="absolute z-20 bottom-10 md:bottom-20 w-full bg-cover bg-center">
        <div className="grid grid-cols-1 gap-2 md:gap-4 px-5 lg:w-[25%] ml-auto mr-40 space-y-5">
          {/* Create Wager */}
          <button
            onClick={() => (setIsOpenInvite(false), setIsOpen(true))}
            className="button bg-[#233d4d] text-[#fcf8db] p-3 text-center items-center group hover:bg-[#f37f2d] transition-all duration-300 ease-in-out border-2 border-[#f37f2d] rounded-lg"
          >
            <div className="flex justify-center gap-2">
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
            onClick={() =>
              (window.location.href = "/dashboard/create-tournament")
            }
          />

          {/* My Invitations */}
          <div
            onClick={() => (setIsOpenInvite(true), setIsOpen(false))}
            className="button bg-[#233d4d] text-[#f37f2d] p-3 text-center items-center group hover:bg-[#f37f2d] transition-all duration-300 ease-in-out border-2 border-[#f37f2d] rounded-lg"
          >
            <div className="flex justify-center gap-2">
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
            onClick={() =>
              (window.location.href = "/dashboard/join-tournament")
            }
          />

          {/* My History */}
          <Link href="" className="w-full">
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
        fadeEffect={{
          crossFade: true,
        }}
        className="w-full h-full"
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
              {/* Background Image with Zoom Effect */}
              <motion.div
                key={currentIndex}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 5,
                  ease: "easeOut",
                  opacity: { duration: 0.3 },
                }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.image}
                  fill
                  alt={slide.name}
                  className="w-full h-full object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
              </motion.div>

              {/* Overlay with Animations */}
              <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/50 px-4 text-center">
                {/* Code-like Text Animation */}
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`${currentIndex}-${slide.name}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0 }}
                    className="relative flex items-center justify-center"
                  >
                    <motion.h2
                      key={currentIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-[1400px] text-[#fcf8db] text-2xl sm:text-4xl md:text-6xl mb-4 font-bold uppercase font-mono flex flex-wrap justify-center gap-1"
                    >
                      {slide.name.split("").map((char, i) => (
                        <motion.span
                          key={`${currentIndex}-${i}`}
                          initial={{
                            opacity: 0,
                            y: 0,
                            x: (i % 2 === 0 ? 1 : -1) * 50,
                            rotate: i * 45,
                            scale: 0,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            x: 0,
                            rotate: 0,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            y: 0,
                            x: (i % 2 === 0 ? 1 : -1) * 50,
                            rotate: i * 45,
                            scale: 0,
                          }}
                          transition={{
                            duration: 0.3,
                            delay: i * 0.02,
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                          }}
                          className="inline-block min-w-[0.5em]"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.h2>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
