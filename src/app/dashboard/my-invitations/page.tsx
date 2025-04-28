"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
// import InviteCard from "@/app/components/dashboard/InviteCard";

const CreateWagerBanner = () => {
  const username = useAuth()?.user?.username || "Challenger";

  // Animation variants for smooth entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen bg-[#0f0f0f] overflow-hidden">
      <Navbar variant="primary" />

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-24 pb-32 md:pt-32 md:pb-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Side Content */}
          <div className="space-y-10">
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tighter leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff4500] to-[#ffa500]">
                {username}&apos;s
              </span>
              <br />
              <span className="text-[#e0e0e0]">Battle Invites</span>
            </motion.h1>

            <div>
              {/* <InviteCard
                name="Call of Duty"
                status="Now"
                prize={2000}
                time="2pm"
                date='12th Aug'
                borderColor="bg-green-500"
              /> */}
            </div>
          </div>

          {/* Right Side Image */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="relative"
          >
            <div className="relative w-full">
              <Image
                src="/assets/m.png"
                alt="Epic Wager Arena"
                width={500}
                height={500}
                className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(255,165,0,0.3)]"
                priority
              />
              {/* Dynamic particle effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#ff4500]/10 to-[#ffa500]/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.5, 0.3],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,#ff4500_2%,transparent_40%)] opacity-15"
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,#ffa500_2%,transparent_40%)] opacity-15"
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Subtle scanline effect */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(transparent,transparent_50%,rgba(255,165,0,0.05)_50%,transparent)] bg-[length:100%_4px]"
          animate={{ y: [-100, 100] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default CreateWagerBanner;
