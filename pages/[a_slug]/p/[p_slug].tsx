import React from "react";
import { GetStaticProps } from "next";
import { server } from "../../../config";
import {
  getProjects,
  getArtists,
  getTracksFromProject,
} from "../../../libs/api";
import useSWR from "swr";
import { fetcher } from "../../../libs/fetcher";
import Image from "next/image";

function matchProjectToArtistSlug(project: Project, artists: Artist[]) {
  const a_uuid = project.sk.split("#")[0];

  return artists.filter((a: Artist) => a.uuid === a_uuid)[0];
}

// Creating static pages with slugs
export async function getStaticPaths() {
  const projects = await getProjects();
  const artists = await getArtists();

  const paths = projects.map((project: Project) => {
    const artist = matchProjectToArtistSlug(project, artists);
    return {
      params: {
        p_slug: project.slug,
        a_slug: artist.slug,
      },
    };
  });

  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export const getStaticProps = async ({ params }: any) => {
  if (!params?.p_slug) return false;

  const projects = await getProjects();
  const artists = await getArtists();

  const project = projects.filter((p: Project) => p.slug === params.p_slug)[0];
  const artist = matchProjectToArtistSlug(project, artists);
  console.log("project getStaticProps===", project);
  console.log("artist getStaticProps===", artist);
  const tracks = await getTracksFromProject(artist.uuid, project.uuid);
  console.log("tracks getStaticProps===", tracks);

  return {
    props: { project: project, artist: artist, tracks: tracks },
  };
};

type propsType = { project: Project; artist: Artist; tracks: Track[] };

export default function Project(props: propsType) {
  console.log("props PAGE ==", props);

  return (
    <>
      <h1 className="text-3xl">{props.project.projectName}</h1>
      <h2 className="text-xl">{props.artist.artistName}</h2>
      <Image
        src={`https://quebra-bucket.s3.eu-west-1.amazonaws.com/projects/${props.project.uuid}/cover.jpg`}
        alt={`${props.project.projectName}, ${props.artist.artistName}`}
        width={500}
        height={500}
      />
      <ol>
        {props.tracks.map((track: Track) => (
          <li key={track.uuid}>{track.track_name}</li>
        ))}
      </ol>
    </>
  );
}
