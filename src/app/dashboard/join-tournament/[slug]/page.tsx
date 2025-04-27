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
  const { store } = useAuth();
  const params = useParams();
  const slug = params?.slug;

  const filterGame = () => {
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
    const getTournament = async () => {
      if (!store.singleTournament) {
        setLoading(true);
        await store.dispatch.getTournament();
      }
      setLoading(false);
    };
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
