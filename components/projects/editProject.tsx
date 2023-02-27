import React from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "../../libs/fetcher";
import { useSession } from "next-auth/react";
import AccessDenied from "../../components/access-denied";
import Router from "next/router";
import UploadCover from "./uploadCover";
import UploadTracks from "./uploadTracks";
import EditTracklist from "./editTracklist";
import { cssButtonPrimary } from "../../libs/css";

interface Uuid {
  uuid: string;
}
interface ProjectEdit {
  project: Project;
  artist: Artist;
  tracks: Tracks[];
}
interface ProjectDelete {
  project: Project;
  artist: Artist;
}
interface TypePublishProject {
  project: Project;
  artist: Artist;
  setLoadingPublish?: Function;
  setStatusLocal?: Function;
}

async function handleDeleteProject({ artist, project }: ProjectDelete) {
  try {
    await fetch(`/api/projects/${artist.uuid}/${project.uuid}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).then((res) => {
      Router.push("/me");
      console.log(res);
      return;
    });
  } catch (error) {
    // setVisibleForm(true);
    console.error(error);
  }
  return;
}

async function publishProject({
  artist,
  project,
  setLoadingPublish,
  setStatusLocal,
}: TypePublishProject) {
  try {
    if (setLoadingPublish) setLoadingPublish(true);
    await fetch(`/api/projects/${artist.uuid}/${project.uuid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).then((res) => {
      if (setLoadingPublish && setStatusLocal) {
        setStatusLocal("PUBLISHED");
        setLoadingPublish(false);
      }
    });
  } catch (error) {
    // setVisibleForm(true);
    console.error(error);
  }
}
async function unPublishProject({
  artist,
  project,
  setStatusLocal,
}: TypePublishProject) {
  try {
    await fetch(`/api/projects/${artist.uuid}/${project.uuid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unpublish: true }),
    }).then((res) => {
      if (setStatusLocal) {
        setStatusLocal("DRAFT");
      }
    });
  } catch (error) {
    // setVisibleForm(true);
    console.error(error);
  }
}

function ContentEditProject({ project, artist, tracks }: ProjectEdit) {
  const [loadingPublish, setLoadingPublish] = React.useState(false);
  const [statusLocal, setStatusLocal] = React.useState(project.status);
  console.log("statusLocal", statusLocal);

  return (
    <>
      <div className="flex align-top justify-between items-center mb-3">
        <div className="flex items-center">
          <h1 className="text-5xl  ">{project.projectName}</h1>
          <span
            className={`ml-5 text-sm ${
              statusLocal === "DRAFT" ? " bg-[#323232] " : " bg-green-500"
            } rounded-sm px-2 `}
          >
            {statusLocal}
          </span>
        </div>
        <button
          onClick={() => handleDeleteProject({ artist, project })}
          className={`${cssButtonPrimary} bg-[#323232] border-b-4 border-jam-light-purple h-auto ml-6`}
        >
          Delete Project
        </button>
      </div>
      <h2 className="text-3xl mb-6 ">Artist: {artist.artistName}</h2>

      <UploadCover project={project} artist={artist} />
      <UploadTracks project={project} artist={artist} />

      {tracks && (
        <EditTracklist tracks={tracks} project={project} artist={artist} />
      )}

      {tracks[0] && statusLocal !== "PUBLISHED" && (
        <div className="flex justify-center m-16">
          <div
            onClick={() => {
              publishProject({
                artist,
                project,
                setLoadingPublish,
                setStatusLocal,
              });
            }}
            className={`${cssButtonPrimary} ${
              loadingPublish ? " cursor-not-allowed opacity-10" : ""
            }`}
          >
            Publish Project
          </div>
        </div>
      )}

      {tracks[0] && statusLocal === "PUBLISHED" && (
        <div className="flex justify-center m-16">
          <div
            onClick={() => {
              unPublishProject({
                artist,
                project,
                setStatusLocal,
              });
            }}
            className={`${cssButtonPrimary}  bg-[#323232]`}
          >
            Unpublish Project
          </div>
        </div>
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
