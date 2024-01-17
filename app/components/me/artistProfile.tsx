import React from "react";
import Link from "next/link";
import Button from "../../components/button";

import { useUser } from "../../pages/me";

type PropsArtistProfile = {
  setShowsetArtist: (a: boolean) => void;
};

const ArtistProfile = ({ setShowsetArtist }: PropsArtistProfile) => {
  const { dataUser, isLoadingUser, errorUser } = useUser();

  // using an array style key.
  if (errorUser || !dataUser.artistName) {
    throw new Error("Error finding Artist");
  }
  if (isLoadingUser)
    return <div data-testid="loading-artist">loading Artist Profile...</div>;
  return (
    <section className="mt-12 rounded-lg border-2 border-jam-purple p-5 pt-0">
      <h2 className="w-min -translate-y-6 bg-jam-dark-purple text-5xl uppercase">
        Artiste
      </h2>
      <h3 className="text-4xl uppercase ">
        <Link href={`/${dataUser.slug}`}>{dataUser.artistName}</Link>
      </h3>
      <span onClick={() => setShowsetArtist(true)}>
        <Button className="mt-2 text-sm" style="dark">
          Modifier mes infos artiste
        </Button>
      </span>
    </section>
  );
};

export default ArtistProfile;
