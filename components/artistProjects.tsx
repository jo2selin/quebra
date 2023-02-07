import React from "react";
import Link from "next/link";

import Button from "./button";
import { fetcher } from "../libs/fetcher";
import useSWR from "swr";

export default function ArtistProjects() {
  const { data, error, isLoading } = useSWR("/api/projects/me", fetcher);
  if (error) return <div>failed to load Artist Projects</div>;
  if (isLoading) return <div>loading Artist Projects...</div>;
  // if (error) throw new Error(error);

  return (
    <div className="pl-5">
      <h2 className="text-5xl uppercase">Projects</h2>
      {data &&
        !data.error &&
        data.map((proj: Project) => {
          return (
            <h3 key={proj.sk} className="text-4xl uppercase ">
              <Link href={`/me/project?uuid=${proj.uuid}`}>
                {proj.projectName}
              </Link>
            </h3>
          );
        })}
      <Button to={"/me/project"} className="text-sm">
        Create a new project
      </Button>
    </div>
  );
}
