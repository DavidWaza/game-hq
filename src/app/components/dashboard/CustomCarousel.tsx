"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const images = [
  { src: "/assets/cod.jpg", name: "Call of Duty" },
  { src: "/assets/dice-banner.jpg", name: "Board Games" },
  { src: "/assets/card.jpg", name: "Card Games" },
  { src: "/assets/sport.jpg", name: "Sport Games" },
];

const CustomCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const totalSlides = images.length;
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate which images to show (3 slides visible at once with centerSlide in the middle)
  const getVisibleSlides = () => {
    const result = [];

    // Get previous slide
    const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    result.push({
      ...images[prevIndex],
      position: -1,
      index: prevIndex,
    });

    // Current slide
    result.push({
      ...images[currentIndex],
      position: 0,
      index: currentIndex,
    });

    // Next slide
    const nextIndex = (currentIndex + 1) % totalSlides;
    result.push({
      ...images[nextIndex],
      position: 1,
      index: nextIndex,
    });

    return result;
  };

  // Function to go to the next slide
  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, totalSlides]);

  // Auto-slide timer
  useEffect(() => {
    autoplayRef.current = setInterval(nextSlide, 5000);

    // Cleanup function
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [nextSlide]);

  // Pause autoplay when user interacts
  const pauseAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };

  // Resume autoplay after user interaction
  const resumeAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    autoplayRef.current = setInterval(nextSlide, 5000);
  };

  // Get visible slides
  const visibleSlides = getVisibleSlides();

  return (
    <div
      className="relative w-full mx-auto overflow-hidden hidden lg:block"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      style={{ height: "400px" }}
    >
      {/* Main Carousel Container */}
      <div className="relative h-full flex items-center justify-center">
        {visibleSlides.map((slide) => {
          const isCenter = slide.position === 0;
          const isLeft = slide.position === -1;
          // const isRight = slide.position === 1;

          // Calculate x position with offset to make side slides visible
          let xPos;
          if (isLeft) xPos = "-70%";
          else if (isCenter) xPos = "0%";
          else xPos = "70%";

          return (
            <motion.div
              key={slide.index}
              className="absolute"
              style={{
                width: "60%",
                height: "350px",
                left: "50%",
                top: "50%",
                marginLeft: "-30%", // Half of width for proper centering
                marginTop: "-175px", // Half of height for proper centering
              }}
              initial={{
                x: slide.position * 100 + "%",
                scale: isCenter ? 0.9 : 0.8,
                zIndex: isCenter ? 10 : 5,
                opacity: isCenter ? 1 : 0.7,
              }}
              animate={{
                x: xPos,
                scale: isCenter ? 1 : 0.85,
                zIndex: isCenter ? 10 : 5,
                opacity: isCenter ? 1 : 0.8,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.5,
              }}
            >
              <div className="relative w-full h-full bg-white rounded-lg overflow-hidden">
                <Image
                  src={slide.src}
                  alt={slide.name}
                  fill
                  className="object-cover"
                />

                {/* Overlay text - only for center slide */}
                {isCenter && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-end pb-16"
                  >
                    <p className="text-[#CBD5E1] font-normal">Wager on</p>
                    <p className="text-4xl text-white">{slide.name}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Slider Indicators (Dots) */}
      <div className="flex justify-center bottom-10 absolute left-1/2 transform -translate-x-1/2 space-x-3 z-50">
        {images.map((_, index) => (
          <motion.button
            key={index}
            className="h-2 w-2 rounded-full focus:outline-none"
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);
              setCurrentIndex(index);
              setTimeout(() => setIsAnimating(false), 600);
            }}
            animate={{
              scale: index === currentIndex ? 1.25 : 1,
              backgroundColor: index === currentIndex ? "#FFFFFF" : "#9CA3AF",
            }}
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomCarousel;
