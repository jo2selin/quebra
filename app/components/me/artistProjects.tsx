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
  if (isLoadingProjects)
    return <div data-testid="loading-projects">loading Artist Projects...</div>;
  // if (error) throw new Error(error);

  const allButDeletedProjects = dataProjects?.filter(
    (p: Project) => p.status !== "DELETED",
  );

  return (
    <div className="mt-12 rounded-lg border-2 border-jam-purple p-5 pt-0">
      <h2 className="w-min -translate-y-6 bg-jam-dark-purple text-5xl uppercase">
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
          className={`text-md  mt-5 basis-0 rounded-sm bg-[#323232] px-4 py-2 text-white   `}
        >
          <a
            href="#openBrevoChat"
            data-testid="max-proj-limit-reached"
            className={`text-md mt-5  text-white    `}
          >
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
                className="mt-10 flex flex-col md:flex-row md:items-center "
              >
                <h3 data-testid="title-project" className="text-4xl uppercase ">
                  <Link href={`/me/project?uuid=${proj.uuid}`}>
                    {proj.projectName}
                  </Link>
                </h3>
                {proj.status === "PUBLISHED" && (
                  <div className="flex">
                    <span
                      data-testid="project-status"
                      className={`rounded-sm bg-[#323232]  px-4   py-2 text-xs md:ml-5  md:px-2 md:py-0 `}
                    >
                      {proj.status}
                    </span>

                    <Link
                      href={`/${artistData.slug}/p/${proj.slug}`}
                      className="ml-5 rounded-sm bg-green-500 px-2  px-4 py-2 text-xs text-white hover:text-green-900  md:px-2 md:py-0"
                    >
                      Lien projet
                    </Link>
                  </div>
                )}
                {proj.status !== "PUBLISHED" && (
                  <div className="flex">
                    <span
                      data-testid="project-status"
                      className={`rounded-sm bg-[#323232] px-4 py-2 text-xs md:ml-5  md:px-2 md:py-0 `}
                    >
                      {proj.status}
                    </span>
                    <span
                      className={`ml-5 rounded-sm bg-jam-purple px-4 py-2 text-xs  md:px-2 md:py-0`}
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
