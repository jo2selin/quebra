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
import { ErrorBoundary } from "react-error-boundary";

interface Uuid {
  uuid: string;
}
interface ProjectEdit {
  project: Project;
  artist: Artist;
  tracks: Track[];
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
  allowedDownload?: boolean;
}

async function handleDeleteProject({ artist, project }: ProjectDelete) {
  try {
    await fetch(`/api/projects/${artist.uuid}/${project.uuid}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path_s3: project.path_s3 }),
    }).then((res) => {
      Router.push("/me");
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
  allowedDownload,
}: TypePublishProject) {
  try {
    if (setLoadingPublish) setLoadingPublish(true);
    await fetch(`/api/projects/${artist.uuid}/${project.uuid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actualStatus: project.status,
        a_slug: artist.slug,
        p_slug: project.slug,
        path_s3: project.path_s3,
        allow_download: allowedDownload,
      }),
    }).then((res) => {
      // console.log("res publishProject", res);

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
  allowedDownload,
}: TypePublishProject) {
  try {
    await fetch(`/api/projects/${artist.uuid}/${project.uuid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        unpublish: true,
        allow_download: allowedDownload,
      }),
    }).then((res) => {
      if (setStatusLocal) {
        setStatusLocal("UNPUBLISHED");
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
  const [coverIsSet, setCoverIsSet] = React.useState(
    project.cover ? true : false
  );
  const [allowedDownload, setAllowedDownload] = React.useState(
    project.allow_download || false
  );

  React.useEffect(() => {
    setStatusLocal(project.status);
  }, [project]);

  // console.log("project", project.status);
  // console.log("statusLocal", statusLocal);
  return (
    <>
      <div className="flex align-top justify-between items-center mb-1">
        <div className="flex items-center">
          <h1 className="text-5xl  ">{project.projectName}</h1>
          <span
            className={`ml-5 text-sm ${
              statusLocal === "PUBLISHED" ? " bg-green-500 " : "  bg-[#323232] "
            } rounded-sm px-2 `}
          >
            {statusLocal === "PUBLISHED" ? (
              <Link
                href={`/${artist.slug}/p/${project.slug}`}
                className="text-white"
              >
                {statusLocal} - Link
              </Link>
            ) : (
              statusLocal
            )}
          </span>
        </div>
        <button
          onClick={() => handleDeleteProject({ artist, project })}
          className={`${cssButtonPrimary} bg-[#323232] border-b-4 border-jam-light-purple h-auto ml-6`}
        >
          Delete Project
        </button>
      </div>
      <h2 className="text-xl mb-6 ">{artist.artistName}</h2>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <UploadCover
          project={project}
          artist={artist}
          status={project.status as string}
          setCoverIsSet={setCoverIsSet}
        />
      </ErrorBoundary>
      <div className="mt-12 p-8 border border-jam-purple rounded">
        <h2 className="text-xl mb-6 ">Vos .mp3</h2>
        {statusLocal === "DRAFT" && (
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <UploadTracks project={project} artist={artist} />
          </ErrorBoundary>
        )}

        {tracks && (
          <EditTracklist
            tracks={tracks}
            project={project}
            artist={artist}
            statusLocal={statusLocal as string}
          />
        )}
      </div>

      {statusLocal !== "PUBLISHED" && (
        <div className="flex my-6">
          <div className="flex items-center justify-center pl-4 border border-jam-purple rounded ">
            <input
              id="allowDownload"
              type="checkbox"
              value=""
              defaultChecked={allowedDownload}
              name="bordered-checkbox"
              className="w-4 h-4  bg-gray-100 border-gray-300 rounded focus:ring-purple-500  "
              onChange={() => setAllowedDownload(!allowedDownload)}
            />
            <label
              htmlFor="allowDownload"
              className="px-4 py-4 ml-2 text-sm font-medium text-white cursor-pointer"
            >
              Autoriser le téléchargement direct (.zip)
            </label>
          </div>
        </div>
      )}

      {tracks[0] && statusLocal !== "PUBLISHED" && coverIsSet && (
        <div className="flex justify-center m-16">
          <div
            onClick={() => {
              publishProject({
                artist,
                project,
                setLoadingPublish,
                setStatusLocal,
                allowedDownload,
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
        <>
          <div className="flex justify-center m-4">
            <div
              onClick={() => {
                unPublishProject({
                  artist,
                  project,
                  setStatusLocal,
                  allowedDownload,
                });
              }}
              className={`${cssButtonPrimary}  bg-[#323232]`}
            >
              Unpublish Project
            </div>
          </div>
          <div className="font-sans md:w-1/2 md:m-auto md:mb-16  bg-jam-light-transparent text-jam-light-purple lowercase text-sm p-2 border-2 border-jam-purple rounded-md ">
            <p>
              Unpublish Project to edit the track&apos;s names.
              <br /> Unpublished projects are not visible to visitors
            </p>
          </div>
        </>
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
    return <AccessDenied />;
  }

  if (projectError) return <div>failed to load this project</div>;
  if (artistError) return <div>failed to load your artist profile</div>;
  if (tracksError) return <div>failed to load your tracks</div>;
  if (projectIsLoading) return <div>loading project...</div>;
  if (artistIsLoading) return <div>loading artist...</div>;
  if (tracksIsLoading) return <div>loading Tracks...</div>;
  // if (artist.uuid === session.user?.email) {
  return (
    <ContentEditProject project={project} artist={artist} tracks={tracks} />
  );
}
