import React from "react";
import SectionRounded from "../sectionRounded";
import Link from "next/link";
import Image from "next/image";

const artistesRap = [
  {
    nom: "GMT93",
    album: "Rythmes en Fusion",
    pays: "France",
    views: 2080,
    dl: 624,
  },
  {
    nom: "Lipse",
    album: "Vers Obscurs",
    pays: "Cameroun",
    views: 810,
    dl: 243,
  },
  {
    nom: "Solaire",
    album: "Lumières Lyriques",
    pays: "France",
    views: 655,
    dl: 497,
  },
  {
    nom: "Flowect",
    album: "Rythmes Surnaturels",
    pays: "France",
    views: 1380,
    dl: 414,
  },
  // { nom: "Leîtrot", album: "Vers d'Or", pays: "France", views: 1945, dl: 583 },
];

function Home_topArtists() {
  return (
    <SectionRounded title={"Top Artists"} className={"mt-8"}>
      <ol className="lg:flex lg:flex-wrap">
        {artistesRap.map((p: any, i) => (
          <li key={i} className="flex-1 transition-transform hover:scale-105">
            <article className="flex items-center px-4 py-2">
              <span className="h-[50px] w-[50px] rounded-full bg-jam-dark-purple"></span>
              <header>
                <h3 className="ml-4">{p.nom}</h3>
              </header>
            </article>
          </li>
        ))}
      </ol>
    </SectionRounded>
  );
}

export default Home_topArtists;
