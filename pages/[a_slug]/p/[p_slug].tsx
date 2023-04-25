import React from "react";
import { GetStaticProps } from "next";
import Player from "../../../components/player";
import DownloadZip from "../../../components/projects/downloadZip";
import Head from "next/head";
import {
  getProjects,
  getArtists,
  getDynamoProjects,
  getDynamoArtists,
  getTracksFromProject,
  getDynamoTracksFromProject,
} from "../../../libs/api";
import Image from "next/image";

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

  if (!project) {
    return {
      notFound: true,
      revalidate: 10,
    };
  }

  let artist;
  try {
    artist = matchProjectToArtistSlug(project as Project, artists as Artist[]);
  } catch (error) {
    console.error(error);
    return false;
  }
  const tracks = await getDynamoTracksFromProject(artist?.uuid, project?.uuid);

  let data;
  if (project && artist && tracks) {
    data = { project: project, artist: artist, tracks: tracks };
  } else {
    data = null;
    return false;
  }

  return {
    props: data,
    revalidate: 10,
  };
};

type propsType = { project: Project; artist: Artist; tracks: Track[] };

export default function Project(props: propsType) {
  const [currentTrack, setTrackIndex] = React.useState(0);
  // console.log("props.project", props);

  if (!props.project) {
    console.error("ERROR ON ", props);
    return false;
  }
  const { projectName, path_s3, slug, allow_download = false } = props.project;

  return (
    <>
      <Head>
        {props.project && (
          <>
            <title>
              {`${projectName} - ${props.artist.artistName} | Quebra`}
            </title>
            <meta property="og:title" content={projectName} key="title" />
          </>
        )}
      </Head>
      <div className="pb-10">
        {props.project && <h1 className="text-3xl">{projectName}</h1>}
        {props.artist && <h2 className="text-xl">{props.artist.artistName}</h2>}
        {props.artist && props.project && (
          <>
            <Image
              src={`https://quebra-bucket.s3.eu-west-1.amazonaws.com/projects/${path_s3}/cover.jpg`}
              alt={`${projectName}, ${props.artist.artistName}`}
              width={500}
              height={500}
            />
            <div className="max-w-[500px]">
              <Player
                tracks={props.tracks}
                p_slug={path_s3}
                currentTrack={currentTrack}
                setTrackIndex={setTrackIndex}
              />
            </div>
          </>
        )}
        {props.tracks && (
          <ol className="max-w-[500px]">
            {props.tracks
              .sort((a, b) => a.track_id - b.track_id)
              .map((track: Track, i) => {
                const isCurrent = currentTrack + 1 === i + 1;
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
                    <span className="p-3 mr-3">{i + 1}</span>
                    {track.track_name}
                  </li>
                );
              })}
          </ol>
        )}

        {allow_download && (
          <div className="max-w-[500px]">
            <DownloadZip path={`/api/projects/${props.artist.slug}/${slug}`} />
          </div>
        )}
      </div>
    </>
  );
}
