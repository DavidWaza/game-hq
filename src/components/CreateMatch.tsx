"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import BetSwitchTab from "@/app/components/dashboard/BetSwitchTab";
import CreateTournament from "@/app/components/dashboard/CreateWagerT";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "date-fns";

type CreateMatchProps = {
  matchMode: number;
  setMatchMode: (val: number) => void;
};

const CreateMatch = ({ matchMode, setMatchMode }: CreateMatchProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const tournamentRef = useRef<{ submitForm: () => boolean | void }>(null);
  const oneVoneRef = useRef<{ submitForm: () => boolean | void }>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<{
    title?: string;
    game_name?: string;
    description?: string;
    amount?: number | null;
    match_date?: string;
    match_time?: string;
  }>({});

  const handleCreateBet = async () => {
    if (matchMode && tournamentRef.current) {
      tournamentRef.current.submitForm();
    } else if (!matchMode && oneVoneRef.current) {
      oneVoneRef.current.submitForm();
    }
  };
  const handleCreateBetConfirm = async () => {
    handleCreateBet();
    setTimeout(() => {
      setShowDialog(false);
    }, 400);
  };

  useEffect(() => {
    if (Object.keys(matchData).length > 0) {
      setShowDialog(true);
    }
  }, [matchData]);

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
              showDialog={showDialog}
              setMatchData={setMatchData}
            />
          ) : (
            <CreateTournament
              ref={tournamentRef}
              loading={loading}
              setLoading={setLoading}
              showDialog={showDialog}
              setMatchData={setMatchData}
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
            Create Game
          </Button>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Read Carefully</DialogTitle>
                <DialogDescription>
                  {matchData.title} - {matchData.game_name}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                {matchData.description && (
                  <div className="text-sm text-gray-500">
                    <span className="font-bold">Game Description:</span>{" "}
                    <div
                      className="rich-text-editor"
                      dangerouslySetInnerHTML={{
                        __html: matchData.description,
                      }}
                    ></div>
                  </div>
                )}
                {matchData.amount && (
                  <p className="text-sm text-gray-500">
                    <span className="font-bold">Wager Amount:</span>{" "}
                    {formatCurrency(matchData.amount)}
                  </p>
                )}
                {matchData.match_date && (
                  <p className="text-sm text-gray-500">
                    <span className="font-bold">Date:</span>{" "}
                    {formatDate(new Date(matchData.match_date), "MMM d, yyyy")}
                  </p>
                )}
                {matchData.match_time && (
                  <p className="text-sm text-gray-500">
                    <span className="font-bold">Time:</span>{" "}
                    {formatDate(
                      new Date(
                        matchData.match_date + "T" + matchData.match_time
                      ),
                      "h:mm a"
                    )}
                  </p>
                )}
              </div>
              <DialogFooter className="sm:justify-start">
                <Button
                  loading={loading}
                  disabled={loading}
                  onClick={handleCreateBetConfirm}
                  variant="primary"
                >
                  Proceed
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
export default CreateMatch;
