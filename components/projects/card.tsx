import React from "react";
import Router from "next/router";
import Image from "next/image";
import Link from "next/link";

type propsType = {
  project: ProjectsWithArtistsData;
};

export default function Card({ project: p }: propsType) {
  return (
    <>
      <div className="flex w-full shadow-lg bg-slate-100 overflow-hidden rounded-xl border-b-jam-dark-grey border-b-4">
        <Link href={`/${p.artist.slug}/p/${p.project.slug}`} className="w-2/5">
          <Image
            src={`https://quebra-bucket.s3.eu-west-1.amazonaws.com/projects/${p.project.path_s3}/cover.jpg`}
            alt={`${p.project.projectName}, ${p.artist.artistName}`}
            width={450}
            height={450}
          />
        </Link>
        <div className="p-4 flex-1">
          <Link href={`/${p.artist.slug}/p/${p.project.slug}`}>
            <h2 className="text-2xl text-jam-purple ">
              {p.project.projectName}
            </h2>
            <h3 className="text-jam-purple">par {p.artist.artistName}</h3>
          </Link>
        </div>
      </div>
    </>
  );
}
