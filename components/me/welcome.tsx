import React from "react";
import Button from "../button";
import { useUser } from "../../pages/me";
import SetArtistProfile from "./setArtistProfile";

type PropsWelcome = {
  setShowsetArtist: (a: boolean) => void;
};

export default function Welcome({ setShowsetArtist }: PropsWelcome) {
  // const { user, isLoading, isError } = useUser();
  // console.log("user SetYourArtistProfile", user);

  return (
    <>
      <h1 className="text-3xl mt-12 mb-5">
        Premierement, creez-vous un nom d&apos;artiste
      </h1>
      <span onClick={() => setShowsetArtist(true)}>
        <Button>Creer un nom d&apos;artiste</Button>
      </span>
    </>
  );
}
