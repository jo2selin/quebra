import React, { useEffect } from "react";
import Card from "./card";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

type propsType = {
  projects: ProjectsWithArtistsData[];
};

const artistesRap = [
  // {
  //   nom: "MC Lumière Noire",
  //   album: "Éclipse totale",
  //   pays: "France",
  //   views: 90,
  //   dl: 567,
  // },
  {
    nom: "La Plume D'Or",
    album: "Rimes Infinies",
    pays: "Belgique",
    views: 175,
    dl: 502,
  },
  // {
  //   nom: "DJ Groove",
  //   album: "Groove urbain",
  //   pays: "Suisse",
  //   views: 422,
  //   dl: 427,
  // },
  {
    nom: "Flow-M",
    album: "L'Art du Verbe",
    pays: "France",
    views: 980,
    dl: 294,
  },
  {
    nom: "Prose Poétique",
    album: "Mots Enflammés",
    pays: "Tunisie",
    views: 1155,
    dl: 347,
  },
  {
    nom: "RapStar3000",
    album: "Microphone Maître",
    pays: "Sénégal",
    views: 2034,
    dl: 610,
  },
  {
    nom: "Lyrical King",
    album: "Couronne de Vers",
    pays: "Côte d'Ivoire",
    views: 2200,
    dl: 660,
  },
  {
    nom: "Funky Phases",
    album: "Sons de la Ville",
    pays: "Maroc",
    views: 1560,
    dl: 468,
  },
  {
    nom: "Naiire",
    album: "Symphonie Hip-Hop",
    pays: "Canada",
    views: 1885,
    dl: 565,
  },
  // {
  //   nom: "Visionnaire",
  //   album: "Réalité Réinventée",
  //   pays: "France",
  //   views: 2170,
  //   dl: 651,
  // },
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

export default function Cards({ projects }: propsType) {
  const { data: session, status } = useSession();

  const [views, setviews] = React.useState(743);
  const [dls, setdls] = React.useState(293);

  useEffect(() => {
    if (views >= 1000000) return;
    const counter = setTimeout(() => {
      setviews(Math.floor(views * 1.035));
      setdls(Math.floor(dls * 1.01));
    }, 500);

    return () => {
      clearTimeout(counter);
    };
  }, [views, dls]);

  return (
    <>
      <div className="mt-10 w-full px-4  ">
        <div className="mb-10 flex w-full overflow-hidden rounded-xl rounded-tr-none border-b-4 border-b-jam-dark-grey shadow-lg sm:w-3/4 md:w-2/3">
          <div className="h-40 w-2/5 animate-pulse bg-jam-purple"></div>

          <div className="flex-1 pl-4">
            <div className=" h-10 animate-pulse bg-jam-purple">
              <p className="p-2">Votre Mixtape</p>
            </div>
            <div className=" mt-4 h-6 w-3/5 animate-pulse bg-jam-purple"></div>
            <div className=" mt-4 mb-2 h-6 w-4/5 animate-pulse bg-jam-purple"></div>
            <p className="pt-2 font-mono text-xs text-white">
              {views} vues , {dls} downloads
            </p>
          </div>
        </div>

        {projects.map((p: any) => (
          <Card key={p.project.uuid} project={p} />
        ))}

        {status !== "authenticated" &&
          artistesRap.map((a, i) => (
            <Link href={`/api/auth/signin`} className="mb-5 flex w-full ">
              <div className="relative w-4/12">
                <img
                  src={`https://picsum.photos/90/90?image=${30 + i}&blur=10`}
                  alt={`${a.nom}, ${a.album}`}
                  width={400}
                  height={400}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="absolute top-1/2 left-1/2 -translate-x-3 -translate-y-3"
                >
                  <path
                    fill="#190B23"
                    d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-5 7.723v2.277h-2v-2.277c-.595-.347-1-.984-1-1.723 0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723zm-5-7.723v-4c0-2.206 1.794-4 4-4 2.205 0 4 1.794 4 4v4h-8z"
                  />
                </svg>
              </div>
              <div className="flex-1 p-4">
                <h2 className="text-2xl text-white ">{a.album}</h2>
                <h3 className="text-jam-pink">par {a.nom}</h3>
                <p className=" font-mono text-xs text-white">
                  {a.pays} - {a.views} vues
                </p>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}
