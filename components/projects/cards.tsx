import React from "react";
import Card from "./card";

type propsType = {
  projects: ProjectsWithArtistsData[];
};

export default function Cards({ projects }: propsType) {
  return (
    <>
      {projects.map((p: any) => (
        <div key={p.project.uuid} className="w-4/6 md:w-1/3 lg:w-1/2 px-4 mb-4">
          <Card project={p} />
        </div>
      ))}
    </>
  );
}
