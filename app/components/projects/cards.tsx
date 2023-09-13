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
      <div className="mt-10 w-full px-4 sm:w-3/4 md:w-2/3 ">
        <div className="mb-10 flex w-full overflow-hidden rounded-xl rounded-tr-none border-b-4 border-b-jam-dark-grey shadow-lg">
          <div className="h-40 w-2/5 animate-pulse bg-jam-purple"></div>

          <div className="flex-1 pl-4">
            <div className=" h-10 animate-pulse bg-jam-purple">
              <p className="p-2">Votre Mixtape</p>
            </div>
            <div className=" mt-4 h-6 w-3/5 animate-pulse bg-jam-purple"></div>
            <div className=" mt-4 mb-2 h-6 w-4/5 animate-pulse bg-jam-purple"></div>
            <p className="pt-2 font-mono text-xs text-white">
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
