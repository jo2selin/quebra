import React from "react";
import Card from "./card";

type propsType = {
  projects: ProjectsWithArtistsData[];
};

export default function Cards({ projects }: propsType) {
  return (
    <>
      {projects.map((p: any) => (
        <div key={p.project.uuid} className="mb-4 w-4/6 px-4 md:w-1/3 lg:w-1/2">
          <Card project={p} />
        </div>
      ))}
    </>
  );
}
