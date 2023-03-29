import React from "react";
import { GetStaticProps } from "next";
import Player from "../../../components/player";
import EditProject from "../../../components/projects/editProject";

import {
  getProjects,
  getArtists,
  getDynamoProjects,
  getDynamoArtists,
  getTracksFromProject,
  getDynamoTracksFromProject,
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
  const projects = await getDynamoProjects();
  const artists = await getDynamoArtists();
  console.log("getStaticPaths artists", artists);

  const paths = projects?.map((project: any) => {
    const artist = matchProjectToArtistSlug(project, artists as Artist[]);
    console.log('"getStaticPaths artist slug ===', artist, project);

    return {
      params: {
        p_slug: project.slug,
        a_slug: artist.slug,
      },
    };
  });

  return {
    paths: paths,
    fallback: true, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export const getStaticProps = async ({ params }: any) => {
  if (!params?.p_slug) return false;

  const projects = await getDynamoProjects();
  const artists = await getDynamoArtists();

  const project = projects?.filter((p: any) => p.slug === params.p_slug)[0];
  const artist = matchProjectToArtistSlug(
    project as Project,
    artists as Artist[]
  );
  const tracks = await getDynamoTracksFromProject(artist.uuid, project?.uuid);

  return {
    props: { project: project, artist: artist, tracks: tracks },
  };
};

type propsType = { project: Project; artist: Artist; tracks: Track[] };

export default function Project(props: propsType) {
  const [currentTrack, setTrackIndex] = React.useState(0);
  console.log("props.tracks===========", props.tracks);

  return (
    <>
      <h1 className="text-3xl">{props.project.projectName}</h1>
      <h2 className="text-xl">{props.artist.artistName}</h2>
      <Image
        src={`https://quebra-bucket.s3.eu-west-1.amazonaws.com/projects/${props.project.path_s3}/cover.jpg`}
        alt={`${props.project.projectName}, ${props.artist.artistName}`}
        width={500}
        height={500}
      />
      <Player
        tracks={props.tracks}
        p_slug={props.project.path_s3}
        currentTrack={currentTrack}
        setTrackIndex={setTrackIndex}
      />
      <ol>
        {props.tracks
          .sort((a, b) => a.track_id - b.track_id)
          .map((track: Track) => (
            <li key={track.uuid}>
              {currentTrack + 1 === +track.track_id && <span>Playing - </span>}
              {track.track_id} -{track.track_name}
            </li>
          ))}
      </ol>
    </>
  );
}
