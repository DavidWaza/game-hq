"use client";
import Navbar from "@/components/Navbar";
import TournamentHero from "@/components/tournament/Hero";
import React, { useCallback, useEffect, useState } from "react";
import { TypeGames } from "../../../../../types/global";
import { useParams } from "next/navigation";
import FullScreenLoader from "@/app/components/dashboard/FullScreenLoader";
import { useAuth } from "@/contexts/AuthContext";

const CreateWager = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGame, setSelectedGame] = useState<TypeGames>();
  const { store } = useAuth();
  const params = useParams();
  const slug = params?.slug;

  const filterGame = useCallback(() => {
    if (store.games?.length && store.singleTournament) {
      const t: TypeGames | undefined = store.games.find(
        (el) => el.id === store?.singleTournament?.game_id
      );
      if (t) {
        setSelectedGame(t);
      }
    }
  }, [store.games, store.singleTournament]);

  useEffect(() => {
    const getTournament = async () => {
      if (!store.singleTournament && store.dispatch && slug) {
        setLoading(true);
        await store.dispatch.getTournament();
      }
      setLoading(false);
    };
    getTournament();
  }, [slug, store.dispatch, store.singleTournament]);

  useEffect(() => {
    if (
      filterGame !== undefined &&
      store.games !== undefined &&
      store.singleTournament !== undefined
    ) {
      filterGame();
    }
  }, [store.games, store.singleTournament, filterGame]);

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
