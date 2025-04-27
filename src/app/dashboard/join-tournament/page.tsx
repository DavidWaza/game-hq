"use client";
import CreateWagerBanner from "@/app/components/dashboard/join-wager-banner";
import Navbar from "@/components/Navbar";
// import TimeBanner from "@/app/components/dashboard/TimeBanner";
import React, { useEffect, useState } from "react";
import { getFn } from "@/lib/apiClient";
import FullScreenLoader from "@/app/components/dashboard/FullScreenLoader";
import { useAuth } from "@/contexts/AuthContext";
import { TypeGames, TypeSingleTournament } from "../../../../types/global";
import TournamentHero from "@/components/tournament/Hero";

type TypeRequestResponse = {
  records: TypeSingleTournament[];
  recordCount: number;
  totalPages: number;
  totalRecords: number;
};

const CreateWager = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<TypeSingleTournament[]>([]);
  const [selectedData, setSelectedData] = useState<TypeSingleTournament>();
  const [selectedGame, setSelectedGame] = useState<TypeGames>();
  const { store } = useAuth();
 


  const getTournaments = async () => {
    setLoading(true);
    try {
      const response: TypeRequestResponse = await getFn(
        "/api/tournamentstables"
      );
      setData(response.records);
      filterForSoonestTournament();
    } catch {
    } finally {
      setLoading(false);
    }
  };
  const getClosestToToday = (items: TypeSingleTournament[]) => {
    const today = new Date();

    return items.reduce(
      (closest: TypeSingleTournament, current: TypeSingleTournament) => {
        const currentDiff = Math.abs(
          new Date(`${current.match_date}T${current.match_time}`).getTime() -
            today.getTime()
        );

        const closestDiff = closest
          ? Math.abs(
              new Date(
                `${closest.match_date}T${closest.match_time}`
              ).getTime() - today.getTime()
            )
          : Infinity;

        return currentDiff < closestDiff ? current : closest;
      }
    );
  };
  const filterForSoonestTournament = () => {
    if (data.length) {
      setSelectedData(getClosestToToday(data));
    }
    return undefined;
  };
  const filterGame = async () => {
    if (store.games?.length && selectedData?.id) {
      const t: TypeGames | undefined = store.games.find(
        (el) => el.id === selectedData.game_id
      );
      if (t) {
        setSelectedGame(t);
      }
    }
  };

  useEffect(() => {
    getTournaments();
  }, []);
  useEffect(() => {
    filterForSoonestTournament();
  }, [data.length]);
  useEffect(() => {
    filterGame();
  }, [selectedData?.id]);

  return (
    <>
      <Navbar variant="primary" />
      {loading && !data.length && !selectedData?.id && !selectedGame?.id ? (
        <FullScreenLoader isLoading={true} text="Loading All Tournaments" />
      ) : (
        <>
          <TournamentHero
            game={selectedGame}
            tournamentDetails={selectedData}
          />
          <CreateWagerBanner tournaments={data} />
        </>
      )}
    </>
  );
};

export default CreateWager;
