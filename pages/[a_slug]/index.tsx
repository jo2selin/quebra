import React from "react";
import { GetStaticProps } from "next";
import { server } from "../../config";
import { getArtists, getDynamoArtists } from "../../libs/api";
import Head from "next/head";

type typePropsArtist = {
  artistName: string;
  slug: string;
};

async function getAllArtists() {
  const artists = await getDynamoArtists();
  return artists;
}

// Creating static pages with slugs
export async function getStaticPaths() {
  const artists = await getAllArtists();
  if (!artists) return false;

  const paths = artists.map((artist: any) => ({
    params: { a_slug: artist.slug },
  }));

  return {
    paths: paths,
    fallback: true, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const artists = await getDynamoArtists();
  // find artist matching w actual slug

  const pageArtist = artists?.filter((a: any) => a.slug === params?.a_slug);
  // console.log("params", params);
  // console.log("pageArtist", pageArtist);

  return {
    props: pageArtist ? pageArtist[0] : [],
    revalidate: 30,
  };
};

export default function Post(props: typePropsArtist) {
  return (
    <>
      <Head>
        <title>{`${props.artistName} | Quebra`}</title>
        <meta property="og:title" content={props.artistName} key="title" />
      </Head>
      <h1>{props.artistName}</h1>
    </>
  );
}
