import React from "react";
import WagerCard from "./WagerCard";

const PublicWagerDisplayBoard = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 py-10">
      <WagerCard
        gameMode={"Tournament"}
        gameCategory={"Sports"}
        gameTitle={"FC 25"}
        gameDateSchedule={"23rd March, 2025"}
        gameUsers={10}
      />
      <WagerCard
        gameMode={"One-v-One"}
        gameCategory={"Action"}
        gameTitle={"Call of Duty"}
        gameDateSchedule={"30th March, 2025"}
        gameUsers={2}
      />
        <WagerCard
        gameMode={"Tournament"}
        gameCategory={"Sports"}
        gameTitle={"FC 25"}
        gameDateSchedule={"23rd March, 2025"}
        gameUsers={10}
      />
      <WagerCard
        gameMode={"One-v-One"}
        gameCategory={"Action"}
        gameTitle={"Call of Duty"}
        gameDateSchedule={"30th March, 2025"}
        gameUsers={2}
      />
        <WagerCard
        gameMode={"Tournament"}
        gameCategory={"Sports"}
        gameTitle={"FC 25"}
        gameDateSchedule={"23rd March, 2025"}
        gameUsers={10}
      />
      <WagerCard
        gameMode={"One-v-One"}
        gameCategory={"Action"}
        gameTitle={"Call of Duty"}
        gameDateSchedule={"30th March, 2025"}
        gameUsers={2}
      />
        <WagerCard
        gameMode={"Tournament"}
        gameCategory={"Sports"}
        gameTitle={"FC 25"}
        gameDateSchedule={"23rd March, 2025"}
        gameUsers={10}
      />
      <WagerCard
        gameMode={"One-v-One"}
        gameCategory={"Action"}
        gameTitle={"Call of Duty"}
        gameDateSchedule={"30th March, 2025"}
        gameUsers={2}
      />
    </div>
  );
};

export default PublicWagerDisplayBoard;
