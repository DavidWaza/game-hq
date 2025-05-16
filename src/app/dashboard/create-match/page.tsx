"use client";
import CreateMatch from "@/components/CreateMatch";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

interface Video {
  id: number;
  src: string;
}
const AllVideoTrailers: Video[] = [
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
  {
    id: 4,
    src: "https://res.cloudinary.com/dgbl43ljm/video/upload/v1743527339/fc25-trailer_eicr53.mp4",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dgbl43ljm/video/upload/v1743527423/mk-trailer-1_zutqhs.mp4",
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/dgbl43ljm/video/upload/v1743527437/cod-trailer-1_jfempg.mp4",
  },
];

const CreateMatchContent = () => {
  const [matchMode, setMatchMode] = useState<number>(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const searchParams = useSearchParams();
  const gameName = searchParams.get("gameName");
  const videoTrailers: Video[] = AllVideoTrailers.slice(
    !matchMode ? 0 : 3,
    !matchMode ? 3 : AllVideoTrailers.length
  );

  // Handle switching videos when one ends
  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex + 1 < videoTrailers.length ? prevIndex + 1 : 0
    );
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * videoTrailers.length);
    setCurrentVideoIndex(randomIndex);
  }, [matchMode, videoTrailers]);

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
      {/* video */}
      <div className="create-wager-banner fixed top-0 left-0 bottom-0 w-dvw h-dvh">
        {process.env.NEXT_PUBLIC_HIDE_VIDEO &&
        process.env.NEXT_PUBLIC_HIDE_VIDEO !== "false" ? (
          <video
            ref={videoRef}
            key={videoTrailers[currentVideoIndex].id}
            className="w-full h-full object-cover"
            src={videoTrailers[currentVideoIndex].src}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
          ></video>
        ) : (
          ""
        )}

        <div className="absolute top-0 left-0 w-full h-full bottom-0 bg-black bg-opacity-50"></div>
      </div>
      <div className=" relative min-h-screen overflow-x-hidden">
        <div className="py-[140px] text-white min-h-screen flex items-center justify-center px-4 max-w-2xl m-auto">
          <CreateMatch
            matchMode={matchMode}
            setMatchMode={setMatchMode}
            gameName={gameName}
          />
        </div>
      </div>
    </>
  );
};

const CreateMatchPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CreateMatchContent />
    </Suspense>
  );
};

export default CreateMatchPage;
