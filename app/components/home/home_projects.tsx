import React from "react";
import SectionRounded from "../sectionRounded";
import Link from "next/link";
import Image from "next/image";

type propsType = {
  projects: { projectsWithArtistsData: ProjectsWithArtistsData[] };
};

function Home_projects({ projects }: propsType) {
  const { projectsWithArtistsData: homeProjects } = projects;

  return (
    <SectionRounded>
      <ol className="lg:flex lg:flex-wrap">
        {homeProjects.map((p: ProjectsWithArtistsData) => (
          <li
            key={p.project.uuid}
            className="flex-1 transition-transform hover:scale-105"
          >
            <Link
              href={`/${p.artist.slug}/p/${p.project.slug}`}
              className=" text-white hover:text-jam-pink"
            >
              <article className="flex px-4 py-2 ">
                <Image
                  src={`https://quebra-bucket.s3.eu-west-1.amazonaws.com/projects/${p.project.path_s3}/cover.jpg`}
                  width={50}
                  height={50}
                  alt={`${p.project.projectName} - ${p.artist.artistName}`}
                  className=" mr-5 h-[50px] w-[50px] rounded-full"
                />
                <header>
                  <h3 className="">{p.project.projectName}</h3>
                  <h4 className="text-jam-pink">{p.artist.artistName}</h4>
                </header>
              </article>
            </Link>
          </li>
        ))}
        <li className="flex-1 transition-transform hover:scale-105">
          <Link href={`/auth/signin`}>
            <article className="flex px-4 py-2 ">
              <span className="mr-5 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-jam-dark-grey text-3xl text-white">
                +
              </span>

              <header>
                <h3 className="text-white">Ajoutez votre projet</h3>
                <h4 className="text-jam-pink">Vous</h4>
              </header>
            </article>
          </Link>
        </li>
      </ol>
    </SectionRounded>
  );
}

export default Home_projects;
