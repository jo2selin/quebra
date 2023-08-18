import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";

import { useSession } from "next-auth/react";
import useSWR from "swr";

// import JamListItem, { JamProps } from "../../components/jam";
import Button from "../../components/button";
import SetYourArtistProfile from "../../components/setYourArtistProfile";
import ArtistProjects from "../../components/artistProjects";
import Router from "next/router";
import slugify from "slugify";

import AccessDenied from "../../components/access-denied";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// type Jams = JamProps[];

function ArtistProfile({ setArtistData }: any) {
  // using an array style key.
  const { data, error, isLoading } = useSWR("/api/users/me/", fetcher);
  if (error) return <div>failed to load Artist Profile</div>;
  if (isLoading) return <div>loading Artist Profile...</div>;
  if (data.artistName && data.sk && data.pk) {
    setArtistData(data);
    return (
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-5xl uppercase">Mon Compte</h1>
          <Button to={"/api/auth/signout"} className="text-sm" style={"dark"}>
            Se déconnecter
          </Button>
        </div>
        <div className="mt-12 pl-5">
          <h2 className="text-5xl uppercase">Artiste</h2>
          <h3 className="text-4xl uppercase ">
            <Link href={`/${data.slug}`}>{data.artistName}</Link>
          </h3>
          <Button to={"/me/artistProfile"} className="text-sm mt-4">
            Modifier mes infos artiste
          </Button>
        </div>
        <div className="mt-12 pl-5"></div>
      </div>
    );
  } else {
    return <SetYourArtistProfile />;
  }
}

const Me: React.FC = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [artistData, setArtistData] = useState<Artist>();

  if (loading) {
    return <p>loading...</p>;
  }

  // If no session exists, display access denied message
  if (status !== "authenticated") {
    return <AccessDenied />;
  }

  return (
    <>
      <Head>
        <title key="title">Me | Quebra</title>
      </Head>
      <div className="md:flex">
        <div className="md:flex-1 mb-20 ">
          <ArtistProfile setArtistData={setArtistData} />
          {artistData && <ArtistProjects artistData={artistData} />}
        </div>
      </div>
    </>
  );
};

export default Me;
