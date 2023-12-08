import { useState } from "react";
import Head from "next/head";

import { useSession, signOut } from "next-auth/react";
import useSWR from "swr";

// import JamListItem, { JamProps } from "../../components/jam";

import ArtistProjects from "../../components/me/artistProjects";
import ArtistProfile from "../../components/me/artistProfile";
import Welcome from "../../components/me/welcome";
import SetArtistProfile from "../../components/me/setArtistProfile";

import AccessDenied from "../../components/access-denied";

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
  const { status } = useSession();
  const { user, isLoading, isError } = useUser();
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
      <div className="mx-auto mb-20 md:max-w-4xl ">
        <div className="flex items-center justify-between">
          <h1 className="text-5xl uppercase">Mon Compte</h1>
          <div
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-md inline-block cursor-pointer rounded-md border-b-4 border-jam-light-purple bg-[#323232] px-4 py-2 text-sm uppercase leading-none text-white hover:text-white"
          >
            Se déconnecter
          </div>
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
    </>
  );
};

export default Me;
