// components/FullScreenLoader.jsx
import Image from "next/image";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
type TypeLoader = {
  isLoading?: boolean;
  text?: string;
};
const FullScreenLoader = ({ isLoading = false, text = "" }: TypeLoader) => {
  const { store } = useAuth();
  const message = text || store.fullScreenLoader.message || "Ready, Set, Play";
  const loader = isLoading || store.fullScreenLoader.loader;
  if (!loader) return null;

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
        <p className="text-white font-semibold mt-2 text-lg">{message}</p>
      </div>
    </section>
  );
};

export default FullScreenLoader;
