"use client";
import CreateWagerBanner from "@/app/components/dashboard/join-wager-banner";
import Navbar from "@/components/Navbar";
import React, { useCallback, useEffect, useState } from "react";
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
  const [filteredData, setFilteredData] = useState<TypeSingleTournament[]>([]);
  const [selectedData, setSelectedData] = useState<TypeSingleTournament>();
  const [selectedGame, setSelectedGame] = useState<TypeGames>();
  const { store } = useAuth();

  const getTournaments = useCallback(async () => {
    setLoading(true);
    try {
      const response: TypeRequestResponse = await getFn(
        "/api/tournamentstables"
      );
      setData(response.records);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);
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
  const filterForSoonestTournament = useCallback(() => {
    if (filteredData.length) {
      setSelectedData(getClosestToToday(filteredData));
    }
    return undefined;
  }, [filteredData]);
  const filterGame = useCallback(async () => {
    if (store.games?.length && selectedData?.id) {
      const t: TypeGames | undefined = store.games.find(
        (el) => el.id === selectedData.game_id
      );
      if (t) {
        setSelectedGame(t);
      }
    }
  }, [selectedData?.id, store.games, selectedData?.game_id]);

  useEffect(() => {
    getTournaments();
  }, [getTournaments]);

  useEffect(() => {
    filterForSoonestTournament();
  }, [filteredData, filterForSoonestTournament]);

  useEffect(() => {
    filterGame();
  }, [selectedData?.id, store?.games?.length, filterGame]);

  useEffect(() => {
    if (store.games?.length && data.length) {
      const gameIds = store.games.map((el) => el.id);
      const filteredData = data.filter((el) => gameIds.includes(el.game_id));
      setFilteredData(filteredData);
    }
  }, [data, store.games]);

  console.log(selectedData);

  return (
    <>
      <Navbar variant="primary" />
      {loading ||
      !filteredData.length ||
      !selectedData?.id ||
      !selectedGame?.id ? (
        <FullScreenLoader isLoading={true} text="Loading All Tournaments" />
      ) : (
        <>
          <TournamentHero
            game={selectedGame}
            tournamentDetails={selectedData}
          />
          <CreateWagerBanner tournaments={filteredData} />
        </>
      )}
    </>
  );
};

export default CreateWager;
