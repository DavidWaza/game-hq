"use client";
import React, { useRef, useState } from "react";
import Button from "@/components/Button";
import BetSwitchTab from "@/app/components/dashboard/BetSwitchTab";
import CreateTournament from "@/app/components/dashboard/CreateWagerT";

type CreateMatchProps = {
  matchMode: number;
  setMatchMode: (val: number) => void;
};

const CreateMatch = ({ matchMode, setMatchMode }: CreateMatchProps) => {
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
    <div className="addTransition w-full max-w-[500px]">
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
          Invite Players
        </button>
        <button
          disabled={loading}
          onClick={() => setMatchMode(1)}
          className="w-full text-center relative h-full rounded-3xl !outline-none !border-none"
        >
          Create Tournament
        </button>
      </div>
      <div className="relative bg-primary text-white py-4 bg-opacity-90 rounded-3xl shadow-lg border-4 border-[#fcf8db] w-full justify_auto h-full">
        <div className="overflow-y-auto px-6 pb-6 w-full">
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
