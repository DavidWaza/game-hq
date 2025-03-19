import React from "react";
import CustomCarousel from "./CustomCarousel";
import FinancialStatements from "./FinancialStatements";
import Banner from "../Banner";
import GameCategories from "./GameCategories";
import CreatePublicWager from "./CreatePublicWager";
import PublicWagerDisplayBoard from "./PublicWagerDisplayBoard";

const MainComponent = () => {
  return (
    <>
      <Banner />
      <div className="mt-5 px-4 sm:px-6 md:px-10 mx-auto">
        <CustomCarousel />
        <div className="">
          <div className="lg:flex justify-between items-center order-1">
            <CreatePublicWager />
            <FinancialStatements />
          </div>
          <PublicWagerDisplayBoard />
          <GameCategories />
        </div>
      </div>
    </>
  );
};

export default MainComponent;
