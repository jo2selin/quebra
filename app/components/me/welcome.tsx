import React from "react";
import Button from "../button";

type PropsWelcome = {
  setShowsetArtist: (a: boolean) => void;
};

export default function Welcome({ setShowsetArtist }: PropsWelcome) {
  return (
    <>
      <h1 className="mt-12 mb-5 text-3xl">
        Premierement, creez-vous un nom d&apos;artiste
      </h1>
      <span onClick={() => setShowsetArtist(true)}>
        <Button>Creer un nom d&apos;artiste</Button>
      </span>
    </>
  );
}
