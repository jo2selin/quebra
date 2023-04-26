import React from "react";
import Link from "next/link";

import Button from "./button";
import { fetcher } from "../libs/fetcher";
import useSWR from "swr";

interface typeArtistProjects {
  artistData: Artist;
}

export default function ArtistProjects({ artistData }: typeArtistProjects) {
  const { data, error, isLoading } = useSWR("/api/projects/me", fetcher);
  // if (error) return <div>failed to load Artist Projects</div>;
  if (isLoading) return <div>loading Artist Projects...</div>;
  // if (error) throw new Error(error);

  return (
    <div className="pl-5">
      <h2 className="text-5xl uppercase">Projects</h2>
      {data &&
        !data.error &&
        data
          .filter((p: Project) => p.status !== "DELETED")
          .map((proj: Project) => {
            return (
              <div key={proj.sk} className="flex items-center ">
                <h3 className="text-4xl uppercase ">
                  <Link href={`/me/project?uuid=${proj.uuid}`}>
                    {proj.projectName}
                  </Link>
                </h3>
                {proj.status === "PUBLISHED" && (
                  <span
                    className={`ml-5 text-xs  bg-green-500  rounded-sm px-2 `}
                  >
                    <Link
                      href={`/${artistData.slug}/p/${proj.slug}`}
                      className="text-white hover:text-green-300"
                    >
                      {proj.status}
                    </Link>
                  </span>
                )}
                {proj.status !== "PUBLISHED" && (
                  <span
                    className={`ml-5 text-xs bg-[#323232] rounded-sm px-2 `}
                  >
                    {proj.status}
                  </span>
                )}
              </div>
            );
          })}
      <Button to={"/me/project"} className="text-sm">
        Create a new project
      </Button>
    </div>
  );
}
