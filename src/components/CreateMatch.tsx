"use client";
import React, { useRef, useState } from "react";
import Button from "@/components/Button";
import BetSwitchTab from "@/app/components/dashboard/BetSwitchTab";
import CreateTournament from "@/app/components/dashboard/CreateWagerT";

type CreateMatch = {
  matchMode: number;
  setMatchMode: (val: number) => void;
  gameName?: string | null;
};
const CreateMatch = ({ matchMode, setMatchMode }: CreateMatch) => {
  const [loading, setLoading] = useState<boolean>(false);
  const tournamentRef = useRef<{ submitForm: () => boolean | void }>(null);
  const oneVoneRef = useRef<{ submitForm: () => boolean | void }>(null);

  const handleCreateBet = async () => {
    if (matchMode && tournamentRef.current) {
      tournamentRef.current.submitForm();
    } else if (!matchMode && oneVoneRef.current) {
      oneVoneRef.current.submitForm();
    }
  };
  return (
    <div className="addTransition w-full lg:w-[500px]">
      {/* controller */}
      <div className="w-full mb-4 rounded-[30px] border-[#fcf8db] border-4 overflow-hidden relative h-[60px] flex items-center justify-between isolate shadow-lg bg-primary">
        <span
          style={{ left: !matchMode ? "6px" : "calc(50% - 6px)" }}
          className="transCube bg-primary-1 active !absolute !h-[calc(100%-12px)] w-1/2 !rounded-3xl"
        ></span>
        <button
          disabled={loading}
          onClick={() => setMatchMode(0)}
          className="w-full text-center relative h-full rounded-3xl !outline-none !border-none"
        >
          1 v 1
        </button>
        <button
          disabled={loading}
          onClick={() => setMatchMode(1)}
          className="w-full text-center relative h-full rounded-3xl !outline-none !border-none"
        >
          Tournament
        </button>
      </div>
      {/* content */}
      <div className="relative bg-primary text-white py-4 bg-opacity-90 rounded-3xl shadow-lg border-4 border-[#fcf8db] w-full justify_auto h-full max-h-[750px]">
        {/* content */}
        <div className="overflow-y-auto px-6 pb-6 w-full hidden_scroll">
          {!matchMode ? (
            <BetSwitchTab
              ref={oneVoneRef}
              loading={loading}
              setLoading={setLoading}
            />
          ) : (
            <CreateTournament
              ref={tournamentRef}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </div>
        {/* bottom section */}
        <div className="max-h-max button-area flex_between gap-3 border-t border-[#fcf8db] pt-4 px-6">
          <Button
            loading={loading}
            disabled={loading}
            onClick={handleCreateBet}
            variant="primary"
          >
            Create Bet
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CreateMatch;
