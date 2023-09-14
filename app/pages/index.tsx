import React from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";

import Button from "../components/button";
import Share_project from "../components/svg/share_project";
import Triangles from "../components/svg/triangles";
import { getDynamoProjects, getDynamoArtists } from "../libs/api";
import groq from "groq";
import client from "../client";
import Img from "next/image";

import newTalents from "../public/new_talents.svg";
const inter = Inter({ subsets: ["latin"] });

// const filterProjectsHome = (projects: Project[]) => {
//   return projects.filter((p) => p.validated === "HOMEPAGE");
// };

// const matchProjectToArtistSlug = (project: Project, artists: Artist[]) => {
//   const a_uuid = project.sk.split("#")[0];
//   const artist = artists.filter((a: Artist) => a.uuid === a_uuid)[0];
//   return artist ? { project, artist } : false;
// };

export async function getStaticProps() {
  // const projects = await getDynamoProjects();
  // const artists = (await getDynamoArtists()) as Artist[];

  // const filteredProjects = filterProjectsHome(projects as Project[]);

  // let projectsWithArtistsData = [] as any;
  // filteredProjects.forEach((p) => {
  //   const res = matchProjectToArtistSlug(p, artists);
  //   projectsWithArtistsData = [...projectsWithArtistsData, res];
  // });

  // const data = { projectsWithArtistsData };

  const query = groq`*[_type == "post"]{
    title,
    "excerpt": array::join(string::split((pt::text(body)), "")[0..50], "") + "..." ,
    slug,
    _createdAt,
    mainImage {
      asset->{
        url,
        metadata
      }
    },
  }| order(_createdAt desc) [0..1]`;
  const postsQuebra = await client.fetch(query);

  return {
    props: { postsQuebra }, // will be passed to the page component as props
  };
}

type propsType = {
  // projectsWithArtistsData: [{ project: Project; artist: Artist }];
  postsQuebra: PostQuebra[];
};

export default function Home(props: propsType) {
  const { postsQuebra } = props;
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
      <div className="relative mx-auto mb-24 max-w-sm">
        <div className="relative z-10">
          <h1 className="text-3xl">
            Uploadez et Partagez <br />
            votre musique <br />
            sur Quebra!
          </h1>
          <Button
            to={status !== "authenticated" ? "/auth/signin" : "/me"}
            className="mt-5"
          >
            Commencer
          </Button>
        </div>
        {/* <Image
          priority
          src={triangles}
          alt=""
          className="absolute -right-3 top-0 z-0 max-w-xl"
          style={{ width: "100%" }}
        /> */}
        <div className="absolute -right-3 top-0 z-0 max-w-xl">
          <Triangles />
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        {postsQuebra.map((post: PostQuebra) => (
          <React.Fragment key={post._id}>
            <Link
              href={`/post/fr/${post.slug.current}`}
              className=" text-white hover:text-jam-pink"
            >
              <article className="relative mb-6 flex items-center justify-center md:first:mr-5">
                <div className=" w-full opacity-30">
                  <Img
                    src={post.mainImage.asset.url + "?h=250&w=500&fit=crop"}
                    width={500}
                    height={250}
                    alt={post.title}
                    placeholder="blur"
                    blurDataURL={post.mainImage.asset.metadata.lqip}
                  />
                </div>
                <div className="absolute max-h-40 w-full overflow-y-auto px-4 ">
                  <h2 className=" text-3xl md:text-2xl">{post.title}</h2>
                  <p className="font-mono text-xs  normal-case ">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          </React.Fragment>
        ))}
      </div>
      <div className="m-auto w-3/4">
        <div className="mb-8 flex flex-col md:flex-row md:items-center">
          <p className="order-2 md:order-1 md:pr-5">
            Nous fournissons une plate-forme où les artistes peuvent partager
            leurs projets musicaux.
          </p>
          {/* <Image
            priority
            src={shareProject}
            alt=""
            className="order-1 md:order-2 "
          /> */}
          <div className="order-1 md:order-2 ">
            <Share_project />
          </div>
        </div>
        <div className="mb-5 flex flex-col md:flex-row">
          <Image priority src={newTalents} alt="" />
          <p className="md:pl-5">
            Nous croyons que chacun devrait avoir la possibilité de présenter
            son travail et de se connecter avec d&apos;autres personnes
            partageant une passion pour la musique.
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
