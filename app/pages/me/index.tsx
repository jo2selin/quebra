import { useState } from "react";
import Head from "next/head";

import { useSession, signOut } from "next-auth/react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { fetcher } from "../../libs/fetcher";

// import JamListItem, { JamProps } from "../../components/jam";

import ArtistProjects from "../../components/me/artistProjects";
import ArtistProfile from "../../components/me/artistProfile";
import Welcome from "../../components/me/welcome";
import MeLayout from "../../components/me/meLayout";
import SetArtistProfile from "../../components/me/setArtistProfile";

import AccessDenied from "../../components/access-denied";
import ErrorBoundary from "components/ErrorBoundary";
import Toast from "components/Toast";

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
  if (errorProjects) {
    toast.error(
      <Toast
        error={"Erreur pour recupérer vos projets"}
        info={errorProjects.status + ": " + errorProjects.statusText}
      />,
      {
        toastId: "useUserProjects",
      },
    );
  }

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
      <MeLayout title={"Mon compte"}>
        <ErrorBoundary>
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
        </ErrorBoundary>
      </MeLayout>
    </>
  );
};

export default Me;
