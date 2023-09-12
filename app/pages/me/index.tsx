import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";

import { useSession } from "next-auth/react";
import useSWR from "swr";

// import JamListItem, { JamProps } from "../../components/jam";

import ArtistProjects from "../../components/me/artistProjects";
import ArtistProfile from "../../components/me/artistProfile";
import Welcome from "../../components/me/welcome";
import SetArtistProfile from "../../components/me/setArtistProfile";

import AccessDenied from "../../components/access-denied";
import Button from "../../components/button";

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }
  return res.json();
};

export function useUser() {
  const { data, error, isLoading } = useSWR(`/api/users/me`, fetcher);
  return {
    user: data,
    isLoading,
    isError: error,
  };
}

export function useUserProjects() {
  const {
    data: dataProjects,
    error: errorProjects,
    isLoading: isLoadingProjects,
  } = useSWR(`/api/projects/me`, fetcher);
  return {
    dataProjects,
    isLoadingProjects,
    errorProjects,
  };
}

const Me: React.FC = () => {
  const { data: session, status } = useSession();
  const { user, isLoading, isError } = useUser();
  const [artistData, setArtistData] = useState<Artist>();
  const [showsetArtist, setShowsetArtist] = useState<boolean>(false);

  // If no session exists, display access denied message
  if (status !== "authenticated") {
    return <AccessDenied />;
  }
  if (isLoading) {
    return <p data-testid="loading">loading...</p>;
  }

  return (
    <>
      <Head>
        <title key="title">Me | Quebra</title>
      </Head>
      <div className="md:flex">
        <div className="mb-20 md:flex-1 ">
          <div className="flex items-center justify-between">
            <h1 className="text-5xl uppercase">Mon Compte</h1>
            <Button to={"/api/auth/signout"} className="text-sm" style={"dark"}>
              Se déconnecter
            </Button>
          </div>
          {!showsetArtist && (
            <>
              {!user?.artistName && (
                <Welcome setShowsetArtist={setShowsetArtist} />
              )}
              {user?.artistName && (
                <ArtistProfile setShowsetArtist={setShowsetArtist} />
              )}
              {user?.artistName && <ArtistProjects artistData={user} />}
            </>
          )}
          {showsetArtist && (
            <SetArtistProfile user={user} setShowsetArtist={setShowsetArtist} />
          )}
        </div>
      </div>
    </>
  );
};

export default Me;
