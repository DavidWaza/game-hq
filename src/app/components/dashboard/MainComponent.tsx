import React from "react";
import FullWidthCarousel from "./FullWidthCarousel";
import Navbar from "@/components/Navbar";

const MainComponent = () => {
  return (
    <>
      <Navbar variant="primary" />
      <FullWidthCarousel />
    </>
  );
};

export default MainComponent;
