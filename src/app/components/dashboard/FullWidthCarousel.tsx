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
  return (
    <div className="relative w-full min-h-screen">
      {/* Permanent Description */}
      <div className="absolute z-20 bottom-0 w-full bg-cover bg-center">
        <div className="grid grid-cols-1 md:grid-cols-1 px-5 lg:w-[40%] mx-auto gap-10">
          {/* Crafting Excellence */}

          <Link href="" className="w-full">
            <div className="bg-[#233d4d] text-[#fcf8db] p-4 sm:p-6 text-center flex flex-col items-center group hover:bg-[#f37f2d] transition-all duration-300 ease-in-out card-one bg-opacity-50">
              <div className="text-3xl font-bold mb-2 sm:mb-4">
                <GameController
                  size={64} 
                  className="text-[#f37f2d] group-hover:text-[#233d4d] transition-all duration-300 ease-in-out group-hover:animate-bounce"
                />
              </div>
              <p className="text-[#f37f2d] text-xl sm:text-3xl font-bold mb-2 sm:mb-6 group-hover:text-[#233d4d] transition-all duration-300 ease-in-out uppercase">
                Create Wager
              </p>
            </div>
          </Link>

          {/* Game Development Portfolio */}
          <Link href="" className="w-full">
            <div className="bg-[#fcf8db] text-center p-4 sm:p-6 flex flex-col items-center group border-2 card-one border-[#233d4d] bg-opacity-50 hover:bg-opacity-100">
              <div className="text-3xl font-bold mb-2 sm:mb-4 relative">
                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-[#f37f2d] absolute -right-3 -top-2 group-hover:animate-bounce items-center justify-center">3</div>
                <EnvelopeSimple
                  size={64}
                  className=" text-[#233d4d] transition-all duration-300 ease-in-out"
                />
              </div>
              <p className=" text-xl sm:text-3xl font-bold mb-2 sm:mb-6 text-[#233d4d] transition-all duration-300 ease-in-out uppercase">
                My Invitations
              </p>
            </div>
          </Link>

          {/* Create Your Dream Game */}
          <Link href="" className="w-full">
            <div className="bg-[#f37f2d] text-center p-4 sm:p-6 flex flex-col items-center group border-2 card-one border-[#233d4d] border-x-0 bg-opacity-50 hover:bg-opacity-100">
              <div className="text-3xl font-bold mb-2 sm:mb-4">
                <Trophy
                  size={64}
                  className="group-hover:text-[#fcf8db] text-[#233d4d] transition-all duration-300 ease-in-out"
                />
              </div>
              <p className="group-hover:text-[#fcf8db] text-xl sm:text-3xl font-bold mb-2 sm:mb-6 text-[#233d4d] transition-all duration-300 ease-in-out uppercase group-hover:animate-bounce">
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
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active'
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
                  {/* Wager on {slide.name} */}
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