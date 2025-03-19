// components/FullScreenLoader.jsx
import Image from "next/image";
import React from "react";

const FullScreenLoader = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  return (
    <section
      style={{ zIndex: 9999999999 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
    >
      <div className="flex flex-col items-center">
        <Image
          src={"/assets/bouncing-ball.svg"}
          alt="Loading animation"
          width={80} 
          height={80} 
          className="w-20 h-auto"
        />
        <p className="text-white font-semibold mt-2 text-lg">Ready, Set, Play</p>
      </div>
    </section>
  );
};

export default FullScreenLoader;
