import React from "react";
import SectionRounded from "../sectionRounded";
import Link from "next/link";
import Image from "next/image";

const content = [
  {
    title:
      "Inscivez-vous pour partager vos créations musicales, gagner en visibilité et offrir aux auditeurs la possibilité de decouvrir vos sons.",
    paragraph: `De plus, vous avez la possibilité de mettre vos projets à disposition en téléchargement, offrant ainsi une expérience complète à votre audience. Rejoignez-nous et faites briller votre musique sur notre plateforme !`,

    image: "upload_icon.png",
  },
  {
    title: `Intégrez vos comptes Spotify, Deezer, YouTube et TikTok  pour regrouper l'ensemble de vos contenus au même endroit, offrant à vos fans une expérience complète.`,
    paragraph: `Cette intégration vous permet de consolider votre présence en ligne et de fidéliser votre public en leur offrant un accès aisé à toutes vos créations, quel que soit le service de streaming qu'ils préfèrent.`,
    image: "link_icon.png",
  },
  {
    title: `Centralisez tous vos liens externes en un seul endroit  offrant ainsi une solution semblable à Linktree ou linkin.bio.`,
    paragraph: `Cette page unique simplifie grandement le partage de vos liens importants. Vous pourrez ainsi mettre en avant vos réseaux sociaux, et d'autres liens pertinents, simplifiant ainsi la navigation pour vos fans et facilitant la promotion de votre musique et de vos projets.`,
    image: "list_icon.png",
  },
];

function Home_presentation() {
  return (
    <div className="mt-8">
      {content.map((c, i) => (
        <div
          className={`mt-8 items-center justify-center md:flex ${
            i % 2 && "flex-row-reverse"
          }`}
        >
          <div className=" w-full text-center md:w-52">
            <Image
              src={`/${c.image}`}
              width={200}
              height={200}
              alt=""
              className={`mx-auto ${i % 2 ? "md:ml-5" : "md:mr-5"}`}
            />
          </div>
          <div className="ml-5 flex-1 ">
            <h4>{c.title}</h4>
            <p className="font-mono text-sm normal-case">{c.paragraph}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home_presentation;
