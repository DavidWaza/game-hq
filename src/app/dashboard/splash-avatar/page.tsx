"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

const SplashAvartar = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.7,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  const avatars = [
    {
      id: "mk",
      src: "/assets/mk-av.svg",
      borderColor: "#b7950b",
      isFull: true,
    },
    {
      id: "cod",
      src: "/assets/cod-av.svg",
      borderColor: "white",
      isFull: false,
    },
    {
      id: "football",
      src: "/assets/cards-av.svg",
      borderColor: "#979a9a",
      isFull: false,
    },
    {
      id: "basketball",
      src: "/assets/basketball-av.svg",
      borderColor: "#f37f2d",
      isFull: false,
    },
    {
      id: "ludo",
      src: "/assets/pawn-av.svg",
      borderColor: "#f37f2d",
      isFull: false,
    },
  ];

  const handleAvatarClick = (avatarId: string) => {
    setSelectedAvatar(avatarId);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#233d4d] via-[#2c586b] to-[#101820] flex flex-col items-center py-10">
      <div className="max-w-[1300px] w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-center pt-20 pb-10 text-6xl text-balance text-[#fcf8db]">
            Choose your avatar
          </p>
        </motion.div>
        <motion.div
          className="flex flex-wrap justify-center gap-8 px-4 sm:px-8 md:px-12 lg:px-20 py-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {avatars.map((avatar) => (
            <motion.div
              key={avatar.id}
              variants={itemVariants}
              className="flex-shrink-0"
            >
              <div
                className={`w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-60 lg:h-60 rounded-full bg-[#233d4d] border-2 ${
                  selectedAvatar === avatar.id
                    ? `border-[${avatar.borderColor}] border-4 scale-110 shadow-xl shadow-[${avatar.borderColor}]/50`
                    : `border-[${avatar.borderColor}]`
                } flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-[${
                  avatar.borderColor
                }]/50 group cursor-pointer`}
                onClick={() => handleAvatarClick(avatar.id)}
              >
                <div className="relative flex items-center justify-center w-full h-full">
                  <Image
                    width={avatar.isFull ? 0 : 60}
                    height={avatar.isFull ? 0 : 60}
                    src={avatar.src}
                    alt={`${avatar.id} Avatar`}
                    className={`${
                      avatar.isFull ? "w-full h-full" : "w-[70%] h-[70%]"
                    } object-${
                      avatar.isFull ? "cover" : "contain"
                    } transition-all duration-300 group-hover:brightness-110`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="py-10">
        <Button
          onClick={() => router.push("/dashboard")}
          disabled={!selectedAvatar}
          className={`${
            !selectedAvatar
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#f37f2d] hover:text-white transition-colors"
          }`}
        >
          Proceed to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default SplashAvartar;
