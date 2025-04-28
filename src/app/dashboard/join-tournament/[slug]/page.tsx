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
  const [data, ] = useState<TypeSingleTournament>();
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
          setState(response, 'singleTournament');
          filterGame();
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
  };
  const filterGame = async () => {
    if (store.games?.length && data?.id) {
      const t: TypeGames | undefined = store.games.find(
        (el) => el.id === data.game_id
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
  }, [store.games, data?.id]);

  return (
    <>
      <Navbar variant="primary" />
      {loading || !data?.id || !selectedGame?.id ? (
        <FullScreenLoader isLoading={true} text="Loading Tournament Details" />
      ) : (
        <>
          <TournamentHero game={selectedGame} tournamentDetails={data} />
        </>
      )}
    </>
  );
};

export default CreateWager;
