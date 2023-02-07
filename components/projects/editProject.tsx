import React from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "../../libs/fetcher";
import { useSession } from "next-auth/react";
import AccessDenied from "../../components/access-denied";
import UploadCover from "./uploadCover";
import UploadTracks from "./uploadTracks";
import EditTracklist from "./editTracklist";
import { useS3Upload } from "next-s3-upload";
interface Uuid {
  uuid: string;
}
interface ProjectEdit {
  project: Project;
  artist: Artist;
  tracks: Tracks[];
}

function ContentEditProject({ project, artist, tracks }: ProjectEdit) {
  return (
    <>
      <h1 className="text-5xl mb-3 ">EDIT {project.projectName}</h1>
      <h2 className="text-3xl mb-6 ">Artist: {artist.artistName}</h2>

      <UploadCover project={project} artist={artist} />
      <UploadTracks project={project} artist={artist} />

      {tracks && (
        <EditTracklist tracks={tracks} project={project} artist={artist} />
      )}

      {/* <label>
          <span className="text-3xl">Artist Name</span>{" "}
          <input
            disabled
            type="text"
            value={project.artistName}
            className={cssInput + " opacity-50 cursor-not-allowed"}
          />
        </label> */}
    </>
  );
}

export default function EditProject({ uuid }: Uuid) {
  // const [user, setUser] = React.useState(null)
  // const [project, setProject] = React.useState(null)
  // const [tracks, setTracks] = React.useState(null)

  const { data: session, status } = useSession();
  const {
    data: artist,
    error: artistError,
    isLoading: artistIsLoading,
  } = useSWR(`/api/users/me`, fetcher);
  // console.log("edit proje data ", artist, artistError, artistIsLoading);

  const {
    data: project,
    error: projectError,
    isLoading: projectIsLoading,
  } = useSWR(
    !artistIsLoading && `/api/projects/${artist.uuid}/${uuid}`,
    fetcher
  );

  const {
    data: tracks,
    error: tracksError,
    isLoading: tracksIsLoading,
  } = useSWR(
    !artistIsLoading && `/api/projects/${artist.uuid}/${uuid}/tracks`,
    fetcher
  );

  if (status !== "authenticated") {
    console.log("!session", session);

    return <AccessDenied />;
  }

  if (projectError) return <div>failed to load this project</div>;
  if (artistError) return <div>failed to load your artist profile</div>;
  if (tracksError) return <div>failed to load your tracks</div>;
  if (projectIsLoading) return <div>loading project...</div>;
  if (artistIsLoading) return <div>loading artist...</div>;
  if (tracksIsLoading) return <div>loading Tracks...</div>;
  if (project.email === session.user?.email) {
    return (
      <ContentEditProject project={project} artist={artist} tracks={tracks} />
    );
  } else {
    throw new Error("You are not the owner of this project");
  }
}
