import React from "react";
import Link from "next/link";

import Button from "../button";
import { useUser, useUserProjects } from "../../pages/me";

interface typeArtistProjects {
  artistData: Artist;
}

export default function ArtistProjects({ artistData }: typeArtistProjects) {
  // const { user, isLoading, isError } = useUser();
  const { dataProjects, isLoadingProjects, errorProjects } = useUserProjects();

  // const { data, error, isLoading } = useSWR("/api/projects/me", fetcher);
  // if (error) return <div>failed to load Artist Projects</div>;
  if (isLoadingProjects) return <div>loading Artist Projects...</div>;
  // if (error) throw new Error(error);

  const allButDeletedProjects = dataProjects?.filter(
    (p: Project) => p.status !== "DELETED"
  );

  return (
    <div className="mt-12 p-5 pt-0 border-2 border-jam-purple rounded-lg">
      <h2 className="text-5xl uppercase -translate-y-6 bg-jam-dark-purple w-min">
        Projects
      </h2>

      {!allButDeletedProjects ||
        (allButDeletedProjects.length < 2 && (
          <Button to={"/me/project"} className="text-sm ">
            Creer nouveau projet
          </Button>
        ))}
      {allButDeletedProjects && allButDeletedProjects.length >= 2 && (
        <div
          className={`mt-5  basis-0 text-md bg-[#323232] text-white rounded-sm px-4 py-2   `}
        >
          <a href="#openBrevoChat" className={`mt-5 text-md  text-white    `}>
            Max projects limit reached ({allButDeletedProjects.length}/2).
          </a>
          <p className="">
            Project are limited to 2,{" "}
            <a href="#openBrevoChat">contact us via chat</a> to add more
          </p>
        </div>
      )}

      {dataProjects && !errorProjects && allButDeletedProjects[0] && (
        <div className="mt-12">
          {allButDeletedProjects.map((proj: Project) => {
            return (
              <div
                key={proj.sk}
                className="flex flex-col mt-10 md:items-center md:flex-row "
              >
                <h3 className="text-4xl uppercase ">
                  <Link href={`/me/project?uuid=${proj.uuid}`}>
                    {proj.projectName}
                  </Link>
                </h3>
                {proj.status === "PUBLISHED" && (
                  <div className="flex">
                    <span
                      className={`md:ml-5 text-xs  bg-[#323232]   rounded-sm px-4 py-2  md:px-2 md:py-0 `}
                    >
                      {proj.status}
                    </span>

                    <Link
                      href={`/${artistData.slug}/p/${proj.slug}`}
                      className="ml-5 text-xs rounded-sm px-2  bg-green-500 text-white hover:text-green-900 px-4 py-2  md:px-2 md:py-0"
                    >
                      Lien projet
                    </Link>
                  </div>
                )}
                {proj.status !== "PUBLISHED" && (
                  <div className="flex">
                    <span
                      className={`md:ml-5 text-xs bg-[#323232] rounded-sm px-4 py-2  md:px-2 md:py-0 `}
                    >
                      {proj.status}
                    </span>
                    <span
                      className={`ml-5 text-xs bg-jam-purple rounded-sm px-4 py-2  md:px-2 md:py-0`}
                    >
                      <Link
                        href={`/me/project?uuid=${proj.uuid}`}
                        className="text-white hover:text-green-300"
                      >
                        edit
                      </Link>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
