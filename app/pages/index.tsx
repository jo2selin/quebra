import React from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";

import Button from "../components/button";
import SectionRounded from "../components/sectionRounded";
import HomeNews from "../components/home/home_news";
import HomeProjects from "../components/home/home_projects";
import HomeTopArtists from "../components/home/home_topArtists";
import HomeProjectOfTheWeek from "../components/home/home_projectOfTheWeek";
import HomePresentation from "../components/home/home_presentation";
import Share_project from "../components/svg/share_project";
import Triangles from "../components/svg/triangles";
import { getDynamoProjects, getDynamoArtists } from "../libs/api";
import groq from "groq";
import client from "../client";
import Img from "next/image";

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

type propsType = {
  postsQuebra: PostQuebra[];
  lastPostQuebra: PostQuebra;
  projects: { projectsWithArtistsData: ProjectsWithArtistsData[] };
};

export default function Home(props: propsType) {
  const { postsQuebra, lastPostQuebra, projects } = props;
  const { data: session, status } = useSession();

  return (
    <>
      <NextSeo
        title={
          "Accueil" + " " + process.env.NEXT_PUBLIC_QUEBRA_META_TITLE_SUFFIX
        }
        description={"Bienvenue sur Quebra.co"}
        canonical={`https://www.quebra.co/`}
        openGraph={{
          url: `https://www.quebra.co/`,
          title:
            "Accueil" + " " + process.env.NEXT_PUBLIC_QUEBRA_META_TITLE_SUFFIX,
          description: "Bienvenue sur Quebra.co",
        }}
      />
      <Head>
        <title key="title">Homepage | Quebra</title>
      </Head>
      <div className=" grid-cols-12 items-start md:grid md:gap-4 lg:gap-10 xl:gap-20">
        <div className=" md:col-span-6 lg:col-span-7 xl:col-span-7 ">
          <Link
            href={`/post/fr/${lastPostQuebra.slug.current}`}
            className=" text-white hover:text-jam-pink"
          >
            <article className=" ">
              <div className="relative w-full  ">
                <Img
                  src={
                    lastPostQuebra.mainImage.asset.url +
                    "?h=500&w=1000&fit=crop"
                  }
                  width={1000}
                  height={500}
                  // fill={true}
                  alt={lastPostQuebra.title}
                  placeholder="blur"
                  blurDataURL={lastPostQuebra.mainImage.asset.metadata.lqip}
                  className="rounded-t-3xl"
                />
              </div>
              <div className="rounded-b-3xl bg-gradient-radial px-6 py-6 md:py-12">
                <h2 className=" text-3xl md:text-2xl">
                  {lastPostQuebra.title}
                </h2>
                <p className="font-mono text-xs  normal-case ">
                  {lastPostQuebra.excerpt}
                </p>
              </div>
            </article>
          </Link>
          <HomeProjects projects={projects} />
        </div>
        <div className="row-auto transition-all duration-300 md:col-span-6 lg:col-span-5 xl:col-span-4 xl:col-end-13 ">
          <HomeNews posts={postsQuebra} />
          <HomeTopArtists />
          <HomeProjectOfTheWeek />
        </div>
        <div className="md:col-span-6 lg:col-span-7 xl:col-span-7">
          <HomePresentation />
        </div>
        <div className=" md:col-span-6 lg:col-span-5 xl:col-span-4 xl:col-end-13"></div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const allProjects = await getDynamoProjects();
  const artists = (await getDynamoArtists()) as Artist[];

  const filteredProjects = filterProjectsHome(allProjects as Project[]);

  let projectsWithArtistsData = [] as any;
  filteredProjects.forEach((p) => {
    const res = matchProjectToArtistSlug(p, artists);
    projectsWithArtistsData = [...projectsWithArtistsData, res];
  });

  const projects = { projectsWithArtistsData };

  const queryPosts = groq`*[_type == "post"]{
    title,
    "excerpt": array::join(string::split((pt::text(body)), "")[0..50], "") + "..." ,
    slug,
    _createdAt,
    _id,
    mainImage {
      asset->{
        url,
        metadata
      }
    },
  }| order(_createdAt desc) [1..6]`;
  const queryLastPost = groq`*[_type == "post"]{
    title,
    "excerpt": array::join(string::split((pt::text(body)), "")[0..150], "") + "..." ,
    slug,
    _createdAt,
    _id,
    mainImage {
      asset->{
        url,
        metadata
      }
    },
  }| order(_createdAt desc)[0]`;
  const postsQuebra = await client.fetch(queryPosts);
  const lastPostQuebra = await client.fetch(queryLastPost);

  return {
    props: { postsQuebra, lastPostQuebra, projects }, // will be passed to the page component as props
    revalidate: 10,
  };
}
