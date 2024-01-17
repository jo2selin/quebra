import React from "react";
import Link from "next/link";

import Button from "../button";
import { useUserProjects } from "../../pages/me";
interface typeArtistProjects {
  artistData: Artist;
}

interface typeLimitProjectReachedProps {
  allButDeletedProjects: Project[];
}

interface typeTag {
  testId?: string;
  tagColor?: string;
  className?: string;
  children: React.ReactNode;
}
interface typeProjectTags {
  status?: string;
  artistData: Artist;
  proj: Project;
}

const LimitProjectReached = ({
  allButDeletedProjects,
}: typeLimitProjectReachedProps) => {
  return (
    <div
      className={`text-md  mt-5 basis-0 rounded-sm bg-[#323232] px-4 py-2 text-white   `}
    >
      <a
        href="#brevoConversationsExpanded"
        data-testid="max-proj-limit-reached"
        className={`text-md mt-5  text-white    `}
      >
        Max projects limit reached ({allButDeletedProjects.length}/2).
      </a>
      <p className="">
        Quebra Beta: Les projets sont limités à 2 par membre, <br />
        <a href="#brevoConversationsExpanded">contactez-nous via chat</a> pour
        augmenter la limite
      </p>
    </div>
  );
};

const Tag = ({
  testId,
  tagColor = "bg-[#323232]",
  className,
  children,
}: typeTag) => {
  return (
    <span
      data-testid={testId}
      className={`rounded-sm ${tagColor} ml-3 px-4 py-2 text-xs md:ml-3 md:px-2 md:py-1 ${className}`}
    >
      {children}
    </span>
  );
};

const ProjectTags = ({ status, artistData, proj }: typeProjectTags) => {
  const isPublished = status === "PUBLISHED" ? true : false;
  const tagColor = isPublished ? "bg-green-500" : "bg-jam-purple";
  return (
    <footer className="flex">
      <Tag testId="project-status" className="ml-0">
        {status}
      </Tag>
      {isPublished && (
        <Tag tagColor={tagColor}>
          <Link
            href={`/${artistData.slug}/p/${proj.slug}`}
            className="text-white hover:text-green-900"
          >
            Lien projet
          </Link>
        </Tag>
      )}
      <Tag tagColor="bg-jam-purple">
        <Link
          href={`/me/project?uuid=${proj.uuid}`}
          className="inline-block text-white "
        >
          Modifier
        </Link>
      </Tag>
    </footer>
  );
};

export default function ArtistProjects({ artistData }: typeArtistProjects) {
  const { dataProjects, isLoadingProjects, errorProjects } = useUserProjects();

  const allButDeletedProjects = dataProjects?.filter(
    (p: Project) => p.status !== "DELETED",
  );

  return (
    <section className="mt-12 rounded-lg border-2 border-jam-purple p-5 pt-0">
      <h2 className="w-min -translate-y-6 bg-jam-dark-purple text-5xl uppercase">
        Projects
      </h2>
      {isLoadingProjects && (
        <div data-testid="loading-projects">loading Artist Projects...</div>
      )}

      {!allButDeletedProjects ||
        (allButDeletedProjects.length < 2 && (
          <Button to={"/me/project"} className="text-sm ">
            Creer nouveau projet
          </Button>
        ))}
      {allButDeletedProjects && allButDeletedProjects.length >= 2 && (
        <LimitProjectReached allButDeletedProjects={allButDeletedProjects} />
      )}

      {dataProjects && !errorProjects && allButDeletedProjects[0] && (
        <div className="mt-12">
          {allButDeletedProjects.map((proj: Project) => {
            return (
              <article
                key={proj.sk}
                className="mt-10 flex flex-col md:flex-row md:items-center "
              >
                <h3 data-testid="title-project" className="text-4xl uppercase ">
                  <Link href={`/me/project?uuid=${proj.uuid}`}>
                    {proj.projectName}
                  </Link>
                </h3>

                <ProjectTags
                  status={proj.status}
                  artistData={artistData}
                  proj={proj}
                />
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
