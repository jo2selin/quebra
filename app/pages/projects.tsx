import Head from "next/head";
import { Inter } from "@next/font/google";
import Cards from "../components/projects/cards";

import { getDynamoProjects, getDynamoArtists } from "../libs/api";
import Link from "next/link";

const filterProjectsHome = (projects: Project[]) => {
  return projects.filter(
    (p) => p.validated === "HOMEPAGE" || p.validated === "OK",
  );
};

const matchProjectToArtistSlug = (project: Project, artists: Artist[]) => {
  const a_uuid = project.sk.split("#")[0];
  const artist = artists.filter((a: Artist) => a.uuid === a_uuid)[0];
  return artist ? { project, artist } : false;
};

export async function getStaticProps() {
  const projects = await getDynamoProjects();

  const artists = (await getDynamoArtists()) as Artist[];

  const filteredProjects = filterProjectsHome(projects as Project[]);

  let projectsWithArtistsData = [] as any;
  filteredProjects.forEach((p) => {
    const res = matchProjectToArtistSlug(p, artists);
    projectsWithArtistsData = [...projectsWithArtistsData, res];
  });

  const data = { projectsWithArtistsData };

  return {
    props: data, // will be passed to the page component as props
  };
}

type propsType = {
  projectsWithArtistsData: [{ project: Project; artist: Artist }];
};
export default function Projects(props: propsType) {
  const { projectsWithArtistsData } = props;

  return (
    <>
      <Head>
        <title key="title">Projets | Quebra</title>
      </Head>
      <h1 className="pb-8 text-4xl">Projets</h1>
      <p className="mb-5 text-lg">
        Faites partie des premiers à uploader vos projets sur Quebra ! <br />
        <Link href="auth/signin">inscrivez-vous</Link>, c&apos;est gratuit
      </p>
      <div className="-mx-4 flex flex-wrap justify-center">
        <Cards projects={projectsWithArtistsData} />
      </div>
    </>
  );
}
