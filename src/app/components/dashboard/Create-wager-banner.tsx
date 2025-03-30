import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import GameCategories from "./GameCategories";

const images = [
  "/assets/m.png",
  "/assets/card-poker.png",
  "/assets/h2_img2_2.png",
];

const CreateWagerBanner = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="h-full px-5 lg:pr-0 lg:pl-20"
      style={{
        background:
          "radial-gradient(circle at center, rgba(252, 248, 219, 0.2), rgba(35, 61, 77, 0.2) 80%)",
      }}
    >
      <div className="grid lg:grid-cols-2 items-start">
        {/* Left Side Content */}
        <div>
          <h1 className="text-[#FCF8DB] uppercase text-6xl py-10 lg:py-20">
            Create a public or private wager
          </h1>

          {/* Create Wager */}
          <GameCategories />
        </div>

        {/* Right Side Image (Independent) */}
        <div className="min-h-screen flex items-center justify-center py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <Image
                src={images[currentImage]}
                alt="Revealing Image"
                width={500}
                height={500}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CreateWagerBanner;
