import React from "react";
import { GetStaticProps } from "next";
import { server } from "../config";
import { loadArtists } from "../libs/load-artists";

type typePropsArtist = {
  artistName: { S: string };
  slug: { S: string };
};

async function getArtists() {
  const artists = await loadArtists();
  return artists;
}

// Creating static pages with slugs
export async function getStaticPaths() {
  const artists = await getArtists();

  const paths = artists.map((artist: any) => ({
    params: { artistSlug: artist.slug.S },
  }));

  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const artists = await getArtists();
  // find artist matching w actual slug
  const pageArtist = artists.filter(
    (a: typePropsArtist) => a.slug.S === params?.artistSlug
  );
  console.log("params", params);
  console.log("pageArtist", pageArtist);

  return {
    props: pageArtist[0],
  };
};

export default function Post(props: typePropsArtist) {
  // Render post...
  console.log("props PAGE ==", props);

  return <h1>{props.artistName.S}</h1>;
}
