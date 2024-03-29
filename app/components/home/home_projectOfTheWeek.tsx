import React from "react";
import SectionRounded from "../sectionRounded";
import Link from "next/link";
import Image from "next/image";

function Home_projectOfTheWeek() {
  return (
    <SectionRounded title={"Projet de la semaine"}>
      <div className="flex items-center justify-center">
        <div className="max-w-52 block h-52 w-full flex-1 rounded-xl bg-jam-dark-purple md:h-36"></div>
      </div>
    </SectionRounded>
  );
}

export default Home_projectOfTheWeek;
