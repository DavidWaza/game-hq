"use client";
import DashboardNavbar from "@/app/components/dashboard/DashboardNavbar";
import React, { useState, useEffect, useRef } from "react";
import CreateWagerT from "../../components/dashboard/CreateWagerT";

interface Video {
  id: number;
  src: string;
}

const videoTrailers: Video[] = [
  { id: 1, src: "/assets/fc25-trailer.mp4" },
  { id: 2, src: "/assets/mk-trailer-1.mp4" },
  { id: 3, src: "/assets/cod-trailer-1.mp4" },
];

const CreateTournament = () => {
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
    <div className="create-wager-banner relative">
      {/* Video Background (Plays One After Another) */}
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

      <div className="absolute inset-0 bg-white bg-opacity-0"></div>

      {/* Navbar */}
      <DashboardNavbar color="text-[#fcf8db]" />

      {/* Content Goes Here */}
      <div className="relative z-10 flex flex-1 items-center justify-center text-white p-10">
        <CreateWagerT />
      </div>
    </div>
  );
};

export default CreateTournament;
