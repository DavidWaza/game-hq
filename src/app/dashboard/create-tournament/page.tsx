"use client";
import React, { useState, useEffect, useRef } from "react";
import CreateWagerT from "../../components/dashboard/CreateWagerT";
import Navbar from "@/components/Navbar";

interface Video {
  id: number;
  src: string;
}

const videoTrailers: Video[] = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dgbl43ljm/video/upload/v1743527339/fc25-trailer_eicr53.mp4",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dgbl43ljm/video/upload/v1743527423/mk-trailer-1_zutqhs.mp4",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dgbl43ljm/video/upload/v1743527437/cod-trailer-1_jfempg.mp4",
  },
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
    <>
      {/* Navbar */}
      <Navbar variant="primary" />
      <div className="create-wager-banner relative h-screen overflow-hidden">
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

        {/* Content Goes Here */}
        <div className="relative z-10 text-white h-full overflow-y-auto">
          <div className="py-[140px] min-h-full flex items-center justify-center">
            <CreateWagerT />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTournament;
