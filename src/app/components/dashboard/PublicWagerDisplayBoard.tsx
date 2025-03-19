import React from "react";
import WagerCard from "./WagerCard";
import { wagerContents } from "../../../../utils/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PublicWagerDisplayBoard = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 py-10">
      {wagerContents.map((wager, index) => (
        <Dialog key={index}>
          <DialogTrigger>
            <WagerCard
              gameMode={wager.gameMode}
              gameCategory={wager.gameCategory}
              gameTitle={wager.gameTitle}
              gameDateSchedule={wager.gameDateSchedule}
              gameUsers={wager.gameUsers}
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Game Rules</DialogTitle>
              <DialogDescription className="py-7">{wager.gameRules}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-between">
              <button className="py-2 px-5 bg-[#0275D8] rounded-lg text-sm text-white hover:bg-[#3498DB] transition-all ease-in-out duration-300">
                Join Wager
              </button>
              <button className="py-2 px-5 bg-[#D9534F] rounded-lg text-sm text-white hover:bg-[#E74C3C] transition-all ease-in-out duration-300">
                Reject Wager
              </button>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default PublicWagerDisplayBoard;
