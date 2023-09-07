import React from "react";
import Link from "next/link";
import Button from "../../components/button";
import SetYourArtistProfile from "./welcome";

import { useUser } from "../../pages/me";

type PropsArtistProfile = {
  setShowsetArtist: (a: boolean) => void;
};

const ArtistProfile = ({ setShowsetArtist }: PropsArtistProfile) => {
  const { user, isLoading, isError } = useUser();

  // using an array style key.
  if (isError || !user.artistName) {
    throw new Error("Error finding Artist");
  }
  if (isLoading) return <div>loading Artist Profile...</div>;
  return (
    <div className="mt-12 p-5 pt-0 border-2 border-jam-purple rounded-lg">
      <h2 className="text-5xl uppercase -translate-y-6 bg-jam-dark-purple w-min">
        Artiste
      </h2>
      <h3 className="text-4xl uppercase ">
        <Link href={`/${user.slug}`}>{user.artistName}</Link>
      </h3>
      <span onClick={() => setShowsetArtist(true)}>
        <Button className="text-sm mt-2" style="dark">
          Modifier mes infos artiste
        </Button>
      </span>
    </div>
  );
};

export default ArtistProfile;
