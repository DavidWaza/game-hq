"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { EnvelopeSimple, GameController, Trophy } from "@phosphor-icons/react";

const slides = [
  { image: "/assets/board.jpg", name: "Board Games", link: "/page1" },
  { image: "/assets/card.jpg", name: "Card Games", link: "/page2" },
  { image: "/assets/cod-3.jpg", name: "Call of Duty", link: "/page3" },
];

const Carousel = () => {
  const invitationCount = 3;
  return (
    <div className="relative w-full h-screen">
      {/* Permanent Description */}
     
      <div className="absolute bottom-28 lg:bottom-10 left-1/2 transform -translate-x-1/2 text-center z-10 w-full px-4">
        <div className="flex  md:justify-center items-center gap-8 md:gap-16 lg:gap-20">
          {/* Create Wagers */}
          <div className="flex flex-col items-center">
            <Link href={"/dashboard/create-wager"} className="group">
              <GameController
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto md:mx-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-400"
                weight="duotone"
                color="#ad9007"
              />
              <p className="text-white text-sm sm:text-lg md:text-xl font-bold transition-colors duration-300 group-hover:text-yellow-400">
                Create Wagers
              </p>
            </Link>
          </div>

          {/* My Invitations with Closer Badge */}
          <div className="relative flex flex-col items-center">
            <Link href={"#"} className="group">
              <div className="relative">
                <EnvelopeSimple
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto md:mx-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-400"
                  weight="duotone"
                  color="#ad9007"
                />
                {invitationCount > 0 && (
                  <span className="absolute -top-1 right-10 md:right-16  bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center">
                    {invitationCount}
                  </span>
                )}
              </div>
              <p className="text-white text-sm sm:text-lg md:text-xl font-bold transition-colors duration-300 group-hover:text-yellow-400">
                My Invitations
              </p>
            </Link>
          </div>

          {/* My Gaming History */}
          <div className="flex flex-col items-center">
            <Link href={"#"} className="group">
              <Trophy
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto md:mx-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-400"
                weight="duotone"
                color="#ad9007"
              />
              <p className="text-white text-sm sm:text-lg md:text-xl font-bold transition-colors duration-300 group-hover:text-yellow-400">
                My Gaming History
              </p>
            </Link>
          </div>
        </div>
      </div>
      {/* Swiper Container */}
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        className="w-full h-screen"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <Image
                src={slide.image}
                width={1920}
                height={1080}
                alt={slide.name}
                className="w-full h-full object-cover object-center"
                priority
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
                  className="text-white text-3xl md:text-5xl font-bold mb-4"
                >
                  Wager on {slide.name}
                </motion.h2>

                {/* Animated Button */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="my-4"
                >
                  <Link
                    href={slide.link}
                    className="text-white text-lg md:text-xl font-bold bg-red-600 px-6 py-3 rounded-lg shadow-lg hover:bg-red-700 transition"
                  >
                    Bet Now
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
