"use client";
import CreateWagerBanner from "@/app/components/dashboard/join-wager-banner";
import Navbar from "@/components/Navbar";
import TimeBanner from "@/app/components/dashboard/TimeBanner";
import React, { useEffect, useState } from "react";
import { TypeSingleTournament } from "../../../../../types/global";
import { useParams } from "next/navigation";
import { getFn } from "@/lib/apiClient";
import FullScreenLoader from "@/app/components/dashboard/FullScreenLoader";

const CreateWager = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<TypeSingleTournament>();
  const params = useParams();
  const slug = params?.slug;

  const getTournament = async () => {
    setLoading(true);
    try {
      const response: TypeSingleTournament = await getFn(
        `/api/tournamentstables/view/${slug}`
      );
      if (response?.id) {
        setData(response);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  console.log(data);
  useEffect(() => {
    getTournament();
  }, [slug]);
  return (
    <>
      <Navbar variant="primary" />
      {loading ? (
        <FullScreenLoader isLoading={true} text="Loading Tournament Details" />
      ) : (
        <>
          <TimeBanner />
          <CreateWagerBanner />
        </>
      )}
    </>
  );
};

export default CreateWager;
