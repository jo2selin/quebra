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
      <div className="bg-jam-dark-grey shadow-lg overflow-hidden rounded-b-xl border-b-jam-purple border-b-4">
        <Link href={`/${p.artist.slug}/p/${p.project.slug}`}>
          <Image
            src={`https://quebra-bucket.s3.eu-west-1.amazonaws.com/projects/${p.project.path_s3}/cover.jpg`}
            alt={`${p.project.projectName}, ${p.artist.artistName}`}
            width={450}
            height={450}
          />
        </Link>
        <div className="p-4">
          <h2 className="text-xl font-bold text-white ">
            {p.project.projectName} - {p.artist.artistName}
          </h2>
        </div>
      </div>
    </>
  );
}
