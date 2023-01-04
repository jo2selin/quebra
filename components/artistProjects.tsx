import React from "react";
import Link from "next/link";

import Button from "./button";
import { fetcher } from "../libs/fetcher";
import useSWR from "swr";

export default function ArtistProjects() {
  const { data, error, isLoading } = useSWR("/api/project", fetcher);
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return (
    <div>
      <h2 className="text-5xl uppercase">Projects</h2>
      <h3 className="text-4xl uppercase ">
        <Link href={`/${"data.slug"}`}>Ma Mixtape 1</Link>
      </h3>
      <Button to={"/project/create"} className="text-sm">
        Create a new project
      </Button>
    </div>
  );
}
