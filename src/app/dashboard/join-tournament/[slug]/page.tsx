"use client";
import Navbar from "@/components/Navbar";
import TournamentHero from "@/components/tournament/Hero";
import React, { useEffect, useState } from "react";
import { TypeGames, TypeSingleTournament } from "../../../../../types/global";
import { useParams } from "next/navigation";
import { getFn } from "@/lib/apiClient";
import FullScreenLoader from "@/app/components/dashboard/FullScreenLoader";
import { useAuth } from "@/contexts/AuthContext";

const CreateWager = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGame, setSelectedGame] = useState<TypeGames>();
  const { store, setState } = useAuth();
  const params = useParams();
  const slug = params?.slug;

  const getTournament = async () => {
    if (!store.singleTournament) {
      setLoading(true);
      try {
        const response: TypeSingleTournament = await getFn(
          `/api/tournamentstables/view/${slug}`
        );
        if (response?.id) {
          setState(response, "singleTournament");
          filterGame();
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    setLoading(false);
  };
  const filterGame = async () => {
    if (store.games?.length && store.singleTournament) {
      const t: TypeGames | undefined = store.games.find(
        (el) => el.id === store?.singleTournament?.game_id
      );
      if (t) {
        setSelectedGame(t);
      }
    }
  };

  useEffect(() => {
    getTournament();
  }, [slug]);

  useEffect(() => {
    filterGame();
  }, [store.games, store.singleTournament]);

  return (
    <>
      <Navbar variant="primary" />
      {loading || !store.singleTournament || !selectedGame?.id ? (
        <FullScreenLoader isLoading={true} text="Loading Tournament Details" />
      ) : (
        <>
          <TournamentHero
            game={selectedGame}
            tournamentDetails={store.singleTournament}
          />
        </>
      )}
    </>
  );
};

export default CreateWager;
