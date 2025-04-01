"use client";
import BetSwitchTab from "@/app/components/dashboard/BetSwitchTab";
import DashboardNavbar from "@/app/components/dashboard/DashboardNavbar";
import React, { useState, useEffect, useRef } from "react";

interface Video {
  id: number;
  src: string;
}

const videoTrailers: Video[] = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dgbl43ljm/video/upload/v1743523772/chess-trailer_kpbtbe.mp4",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dgbl43ljm/video/upload/v1743523771/ludo-trailer_seabb0.mp4",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dgbl43ljm/video/upload/v1743523774/whot-trailer_qykuo4.mp4",
  },
];

const CreateOneVOne = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle switching videos when one ends
  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex + 1 < videoTrailers.length ? prevIndex + 1 : 0
    );
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement
        .play()
        .catch((err) => console.warn("Auto-play blocked:", err));
    }

    return () => {
      if (videoElement) {
        videoElement.pause();
      }
    };
  }, [currentVideoIndex]);

  return (
    <div className="create-wager-banner relative min-h-screen flex flex-col">
      <video
        ref={videoRef}
        key={videoTrailers[currentVideoIndex].id}
        className="absolute inset-0 w-full h-full object-cover"
        src={videoTrailers[currentVideoIndex].src}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
      ></video>

      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Navbar */}
      <DashboardNavbar color="text-[#fcf8db]" />

      {/* Content Centered in the Middle */}
      <div className="relative z-10 flex flex-1 items-center justify-center text-white p-10">
        <BetSwitchTab />
      </div>
    </div>
  );
};

export default CreateOneVOne;
