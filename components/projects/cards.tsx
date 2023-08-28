import React, { useEffect } from "react";
import Card from "./card";

type propsType = {
  projects: ProjectsWithArtistsData[];
};

export default function Cards({ projects }: propsType) {
  const [views, setviews] = React.useState(743);
  const [dls, setdls] = React.useState(293);

  useEffect(() => {
    if (views >= 1000000) return;
    const counter = setTimeout(() => {
      setviews(Math.floor(views * 1.035));
      setdls(Math.floor(dls * 1.01));
    }, 500);

    return () => {
      clearTimeout(counter);
    };
  }, [views, dls]);

  return (
    <>
      <div className="w-full sm:w-3/4 md:w-2/3 mt-10 px-4 ">
        <div className="flex w-full shadow-lg mb-10 overflow-hidden rounded-xl rounded-tr-none border-b-jam-dark-grey border-b-4">
          <div className="w-2/5 bg-jam-purple h-40 animate-pulse"></div>

          <div className="pl-4 flex-1">
            <div className=" bg-jam-purple h-10 animate-pulse">
              <p className="p-2">Votre Mixtape</p>
            </div>
            <div className=" mt-4 bg-jam-purple h-6 w-3/5 animate-pulse"></div>
            <div className=" mt-4 mb-2 bg-jam-purple h-6 w-4/5 animate-pulse"></div>
            <p className="text-white text-xs pt-2 font-mono">
              {views} vues , {dls} downloads
            </p>
          </div>
        </div>

        {projects.map((p: any) => (
          <Card key={p.project.uuid} project={p} />
        ))}
      </div>
    </>
  );
}
