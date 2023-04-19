import React from "react";
import { GetStaticProps } from "next";
import Player from "../../../components/player";
import EditProject from "../../../components/projects/editProject";
import Head from "next/head";
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
import { log } from "console";

function matchProjectToArtistSlug(project: Project, artists: Artist[]) {
  const a_uuid = project.sk.split("#")[0];

  return artists.filter((a: Artist) => a.uuid === a_uuid)[0];
}

// Creating static pages with slugs
export async function getStaticPaths() {
  const projects = await getDynamoProjects();
  const artists = await getDynamoArtists();

  const paths = projects?.map((project: any) => {
    const artist = matchProjectToArtistSlug(project, artists as Artist[]);

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

  let project;
  try {
    project = projects?.filter((p: any) => p.slug === params.p_slug)[0];
  } catch (error) {
    console.error(error);
    return false;
  }

  // if (!project) {
  //   console.log("dont exist the project", project);
  //   return false;
  // }

  let artist;
  try {
    artist = matchProjectToArtistSlug(project as Project, artists as Artist[]);
  } catch (error) {
    console.error(error);
    return false;
  }
  const tracks = await getDynamoTracksFromProject(artist?.uuid, project?.uuid);

  console.log(
    "getStaticProps===>",
    project,
    artist,
    "nbr tracks:",
    tracks?.length
  );

  let data;
  if (project && artist && tracks) {
    data = { project: project, artist: artist, tracks: tracks };
  } else {
    data = null;
  }

  return {
    props: data,
    revalidate: 5,
    notFound: data === null ? true : false,
  };
};

type propsType = { project: Project; artist: Artist; tracks: Track[] };

export default function Project(props: propsType) {
  const [currentTrack, setTrackIndex] = React.useState(0);

  return (
    <>
      <Head>
        {props.project && (
          <>
            <title>
              {props.project.projectName} - {props.artist.artistName} | Quebra
            </title>
            <meta
              property="og:title"
              content={props.project.projectName}
              key="title"
            />
          </>
        )}
      </Head>

      {props.project && (
        <h1 className="text-3xl">{props.project.projectName}</h1>
      )}
      {props.artist && <h2 className="text-xl">{props.artist.artistName}</h2>}
      {props.artist && props.project && (
        <>
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
        </>
      )}
      {props.tracks && (
        <ol>
          {props.tracks
            .sort((a, b) => a.track_id - b.track_id)
            .map((track: Track, i) => {
              const isCurrent = currentTrack + 1 === +track.track_id;
              return (
                <li
                  key={track.uuid}
                  className={`border-l-4 px-3 py-4  ${
                    isCurrent
                      ? " border-jam-pink  bg-jam-light-transparent "
                      : "border-jam-dark-purple"
                  } cursor-pointer`}
                  onClick={() => setTrackIndex(i)}
                >
                  <span className="p-3 mr-3">{track.track_id}</span>
                  {track.track_name}
                </li>
              );
            })}
        </ol>
      )}
    </>
  );
}
