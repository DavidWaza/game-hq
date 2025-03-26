"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/effect-fade";
import { EnvelopeSimple, GameController, Trophy } from "@phosphor-icons/react";

const slides = [
  { image: "/assets/board.jpg", name: "Roll the dice ", link: "/page1" },
  { image: "/assets/card.jpg", name: "Card Games", link: "/page2" },
  { image: "/assets/cod-3.jpg", name: "we are out of ammunition, we won't be firing any warning shots", link: "/page3" },
];

const Carousel = () => {
  return (
    <div className="relative w-full min-h-screen">
      {/* Permanent Description */}
      <div className="absolute z-20 bottom-10 md:bottom-20 w-full bg-cover bg-center">
        <div className="grid grid-cols-1 gap-2 md:gap-4 px-5 lg:w-[25%] ml-auto mr-40">
          {/* Create Wager */}
          <Link href="/dashboard/create-wager" className="w-full">
            <div className="card-one bg-[#233d4d] text-[#fcf8db] p-2 md:p-3 text-center flex flex-col items-center group hover:bg-[#f37f2d] transition-all duration-300 ease-in-out border-2 border-[#f37f2d] rounded-lg">
              <GameController
                size={32}
                className="text-[#f37f2d] group-hover:text-[#233d4d] transition-all duration-300 ease-in-out group-hover:animate-bounce"
              />
              <p className="text-sm md:text-lg font-bold mt-1 uppercase group-hover:text-[#233d4d]">
                Create Wager
              </p>
            </div>
          </Link>

          {/* My Invitations */}
          <Link href="" className="w-full">
            <div className="card-one bg-[#fcf8db] text-center p-2 md:p-3 flex flex-col items-center group border-2 border-[#233d4d] rounded-lg hover:bg-opacity-100 transition-all duration-300 ease-in-out">
              <div className="relative">
                <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-[#f37f2d] absolute -right-2 -top-1 group-hover:animate-bounce">3</div>
                <EnvelopeSimple
                  size={32}
                  className="text-[#233d4d] transition-all duration-300 ease-in-out"
                />
              </div>
              <p className="text-sm md:text-lg font-bold mt-1 uppercase text-[#233d4d]">
                My Invitations
              </p>
            </div>
          </Link>

          {/* My History */}
          <Link href="" className="w-full">
            <div className="card-one bg-[#f37f2d] text-center p-2 md:p-3 flex flex-col items-center group border-2 border-[#233d4d] rounded-lg hover:bg-opacity-100 transition-all duration-300 ease-in-out">
              <Trophy
                size={32}
                className="group-hover:text-[#fcf8db] text-[#233d4d] transition-all duration-300 ease-in-out"
              />
              <p className="text-sm md:text-lg font-bold mt-1 uppercase text-[#233d4d] group-hover:text-[#fcf8db] group-hover:animate-bounce">
                My History
              </p>
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
