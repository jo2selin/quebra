import React from "react";
import Link from "next/link";

import Button from "./button";
import { fetcher } from "../libs/fetcher";
import useSWR from "swr";

export default function ArtistProjects() {
  const { data, error, isLoading } = useSWR("/api/projects/me", fetcher);
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="pl-5">
      <h2 className="text-5xl uppercase">Projects</h2>
      {data.map((proj: Project) => {
        console.log(proj);

        return (
          <h3 key={proj.sk} className="text-4xl uppercase ">
            <Link href={`/project/${proj.sk}`}>{proj.projectName}</Link>
          </h3>
        );
      })}
      <Button to={"/project/create"} className="text-sm">
        Create a new project
      </Button>
    </div>
  );
}
