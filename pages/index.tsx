import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Link from "next/link";

import Button from "../components/button";

import { getDynamoProjects, getDynamoArtists } from "../libs/api";

import triangles from "../public/triangles.svg";
import shareProject from "../public/share_project.svg";
import newTalents from "../public/new_talents.svg";
const inter = Inter({ subsets: ["latin"] });

const filterProjectsHome = (projects: Project[]) => {
  return projects.filter((p) => p.validated === "HOMEPAGE");
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

export default function Home(props: propsType) {
  const { projectsWithArtistsData } = props;

  return (
    <>
      <Head>
        <title key="title">Homepage | Quebra</title>
      </Head>
      <div className="max-w-sm mx-auto relative mb-24">
        <div className="relative z-10">
          <h1 className="text-3xl">
            Upload and Share <br />
            your music <br />
            with the world!
          </h1>
          {/* <Button to={"/auth/signin"} className="mt-5">
            Get started
          </Button> */}
        </div>
        <Image
          priority
          src={triangles}
          alt=""
          className="absolute z-0 -right-3 top-0 max-w-xl"
          style={{ width: "100%" }}
        />
      </div>
      <div className="w-3/4 m-auto">
        <div className="flex flex-col md:flex-row mb-8">
          <p className="md:pr-5 order-2 md:order-1">
            We provide a platform where Artists can upload and share their
            musical projects with others.
          </p>
          <Image
            priority
            src={shareProject}
            alt=""
            className="order-1 md:order-2 "
          />
        </div>
        <div className="flex flex-col md:flex-row mb-5">
          <Image priority src={newTalents} alt="" />
          <p className="md:pl-5">
            We believe that everyone should have the opportunity to showcase
            their work and connect with others who share their passion for
            music.
          </p>
        </div>
      </div>
      {/* <h2 className="text-2xl">Latest releases</h2>
      <div className="flex flex-wrap -mx-4 justify-center">
        {projectsWithArtistsData.map((p: any) => (
          <div
            key={p.project.uuid}
            className="w-4/6 md:w-1/3 lg:w-1/2 px-4 mb-4"
          >
            <div className="bg-jam-dark-grey shadow-lg overflow-hidden rounded-b-xl border-b-jam-purple border-b-4">
              <Link href={`/${p.artist.slug}/p/${p.project.slug}`}>
                <Image
                  src={`https://quebra-bucket.s3.eu-west-1.amazonaws.com/projects/${p.project.path_s3}/cover.jpg`}
                  alt={`${p.project.projectName}, ${p.artist.artistName}`}
                  width={450}
                  height={450}
                />
              </Link>
              <div className="p-4">
                <h2 className="text-xl font-bold text-white ">
                  {p.project.projectName} - {p.artist.artistName}
                </h2>
               
              </div>
            </div>
          </div>
        ))}
      </div> */}
    </>
  );
}
