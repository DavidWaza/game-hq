"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/effect-fade";
import {
  GameController,
  Intersect,
  Trophy,
} from "@phosphor-icons/react";
import { useState } from "react";
import Modal from "./Modal";

const slides = [
  { image: "/assets/board.jpg", name: "Roll the dice", link: "/page1" },
  {
    image: "/assets/card.jpg",
    name: "One Ace, Two Kings, Three Queens, Four Jacks, Five Tens. Royal flush!",
    link: "/page2",
  },
  {
    image: "/assets/cod-3.jpg",
    name: "We won't be firing any warning shots",
    link: "/page3",
  },
];

const Carousel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenInvite, setIsOpenInvite] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Buttons Container */}
      <div className="absolute z-20 bottom-4 sm:bottom-6 md:bottom-10 lg:bottom-20 w-full px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto lg:ml-auto lg:mr-10">
          {/* Create Wager */}
          <button
            onClick={() => (setIsOpenInvite(false), setIsOpen(true))}
            className="w-full bg-[#233d4d] text-[#fcf8db] py-3 sm:py-4 text-center group hover:bg-[#f37f2d] transition-all duration-300 ease-in-out border-2 border-[#f37f2d] rounded-lg"
          >
            <div className="flex justify-center items-center gap-2">
              <GameController
                size={24}
                className="text-[#FCF8DB] group-hover:text-[#233d4d] transition-all duration-300 ease-in-out group-hover:animate-bounce"
              />
              <p className="text-sm sm:text-base md:text-lg font-bold uppercase group-hover:text-[#233d4d]">
                Create Wager
              </p>
            </div>
          </button>
          <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            firstButtonText="Create Tournament"
            secondButtonText="Create One-on-One"
            onClick={() =>
              (window.location.href = "/dashboard/create-tournament")
            }
            onTab={() => (window.location.href = "/dashboard/create-one-v-one")}
          />

          {/* My Invitations */}
          <button
            onClick={() => (setIsOpenInvite(true), setIsOpen(false))}
            className="w-full bg-[#233d4d] text-[#f37f2d] py-3 sm:py-4 text-center group hover:bg-[#f37f2d] transition-all duration-300 ease-in-out border-2 border-[#f37f2d] rounded-lg"
          >
            <div className="flex justify-center gap-2">
              <Intersect
                size={24}
                weight="duotone"
                className="text-[#FCF8DB] group-hover:text-[#233d4d] transition-all duration-300 ease-in-out group-hover:animate-bounce"
              />

              <p className="text-sm sm:text-base md:text-lg font-bold uppercase group-hover:text-[#233d4d]">
                Join Wager
              </p>
            </div>
          </button>

          <Modal
            isOpen={isOpenInvite}
            setIsOpen={setIsOpenInvite}
            firstButtonText="Join Tournament"
            secondButtonText="Join One-on-One"
            onClick={() =>
              (window.location.href = "/dashboard/join-tournament")
            }
          />

          {/* My History */}
          <Link href="" className="w-full">
            <div className="bg-[#233d4d] text-[#fcf8db] text-center group hover:bg-[#f37f2d] transition-all duration-300 ease-in-out border-2 border-[#f37f2d] rounded-lg">
              <div className="py-3 sm:py-4 flex justify-center gap-2">
                <Trophy
                  size={24}
                  className=" text-[#FCF8DB] group-hover:text-[#233d4d] transition-all duration-300 ease-in-out group-hover:animate-bounce"
                />
                <p className="text-sm sm:text-base md:text-lg font-bold uppercase group-hover:text-[#233d4d]">
                  My Games
                </p>
              </div>
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
        fadeEffect={{ crossFade: true }}
        className="w-full h-full"
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full flex items-center justify-center">
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                />
              </motion.div>

              {/* Overlay with Animations */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 px-4 sm:px-6 md:px-8 text-center">
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
                      className="max-w-[90%] sm:max-w-[85%] md:max-w-[1400px] text-[#fcf8db] text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold uppercase flex flex-wrap justify-center gap-1"
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
