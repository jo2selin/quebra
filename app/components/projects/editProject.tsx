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
import PublishProject from "./publishProject";
import { cssButtonPrimary } from "../../libs/css";
import { ErrorBoundary } from "react-error-boundary";
import Info from "../me/info";
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

// const PublishProject = ({ publishingProject }: any) => {
//   const {
//     artist,
//     project,
//     setLoadingPublish,
//     setStatusLocal,
//     allowedDownload,
//     loadingPublish,
//   } = publishingProject;
//   return (
//     <div className="flex justify-center m-16">
//       <div
//         onClick={() => {
//           publishProject({
//             artist,
//             project,
//             setLoadingPublish,
//             setStatusLocal,
//             allowedDownload,
//           });
//         }}
//         className={`${cssButtonPrimary} ${
//           loadingPublish ? " cursor-not-allowed opacity-10" : ""
//         }`}
//       >
//         Publish Project
//       </div>
//     </div>
//   );
// };

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
  const [statusLocal, setStatusLocal] = React.useState(project.status);
  const [coverIsSet, setCoverIsSet] = React.useState(
    project.cover ? true : false,
  );
  const [allowedDownload, setAllowedDownload] = React.useState(
    project.allow_download || false,
  );

  React.useEffect(() => {
    setStatusLocal(project.status);
  }, [project]);

  // console.log("project", project.status);
  // console.log("statusLocal", statusLocal);
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className=" flex-1 md:order-2">
          <div className="mb-1 flex items-center justify-between align-top">
            <div className="flex items-center">
              <h1 className="text-5xl  ">{project.projectName}</h1>
            </div>
          </div>
          <h2 className="mb-6 text-xl ">{artist.artistName}</h2>

          <div className="mb-6 flex h-14 items-center md:order-2">
            <div
              className={` text-md mr-3 rounded-md bg-[#323232] px-3 py-1  `}
            >
              {statusLocal}
            </div>

            {statusLocal === "PUBLISHED" && (
              <Link href={`/${artist.slug}/p/${project.slug}`}>
                <div className="mr-3 rounded-md border-b-4 border-green-900 bg-green-500 px-3 py-1  text-white hover:border-b-2 hover:text-green-900 ">
                  Lien projet
                </div>
              </Link>
            )}
            <div className="flex items-end justify-end md:flex-1">
              {/* <button
                onClick={() => handleDeleteProject({ artist, project })}
                className={`${cssButtonPrimary} bg-[#323232] border-b-4 border-jam-light-purple h-auto ml-6`}
              >
                Delete Project
              </button> */}
              <div
                onClick={() => handleDeleteProject({ artist, project })}
                className="cursor-pointer rounded-md border-b-4 border-red-900 bg-red-500 px-3 py-1  text-white hover:border-b-2 hover:text-red-900 "
              >
                Supprimer projet
              </div>
            </div>
          </div>
        </div>
        <div className="md:order-1 md:ml-10"></div>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <UploadCover
            project={project}
            artist={artist}
            status={project.status as string}
            setCoverIsSet={setCoverIsSet}
          />
        </ErrorBoundary>
      </div>
      <div className="mt-12 rounded border border-jam-purple p-8">
        <div className="border-l-8 border-jam-purple pl-3 ">
          <h2 className="mb-1 text-3xl ">Uploadez vos .mp3</h2>
          <h3 className="mb-6 font-serif text-sm normal-case opacity-80 ">
            Selectionnez tous les .mp3 de votre projet
          </h3>
        </div>
        {statusLocal === "DRAFT" && (
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <UploadTracks project={project} artist={artist} />
          </ErrorBoundary>
        )}
      </div>
      <div className="mt-12 rounded border border-jam-purple p-8">
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
        <div className="my-6 flex">
          <div className="flex items-center justify-center rounded border border-jam-purple pl-4 ">
            <input
              id="allowDownload"
              type="checkbox"
              value=""
              defaultChecked={allowedDownload}
              name="bordered-checkbox"
              className="h-4 w-4  rounded border-gray-300 bg-gray-100 focus:ring-purple-500  "
              onChange={() => setAllowedDownload(!allowedDownload)}
            />
            <label
              htmlFor="allowDownload"
              className="ml-2 cursor-pointer px-4 py-4 text-sm font-medium text-white"
            >
              Autoriser le téléchargement direct (.zip)
            </label>
          </div>
        </div>
      )}

      {tracks[0] && statusLocal !== "PUBLISHED" && !coverIsSet && (
        <div className="flex flex-col  items-center justify-center">
          <div
            className={`${cssButtonPrimary} cursor-not-allowed  bg-[#323232]  opacity-50`}
          >
            Publier
          </div>

          <Info
            type="info"
            text="Vous devez ajouter une pochette avant de pouvoir publier le projet"
            className={"mt-5"}
          />
        </div>
      )}
      {tracks[0] && statusLocal !== "PUBLISHED" && coverIsSet && (
        <PublishProject
          publishingProject={{
            artist,
            project,
            setStatusLocal,
            allowedDownload,
          }}
        />
      )}

      {tracks[0] && statusLocal === "PUBLISHED" && (
        <>
          <div className="m-4 flex justify-center">
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
          <div className="rounded-md border-2 border-jam-purple bg-jam-light-transparent  p-2 font-sans text-sm lowercase text-jam-light-purple md:m-auto md:mb-16 md:w-3/4 ">
            <ul className="list-inside list-disc">
              <li>Annuler la publication pour editer le nom des pistes.</li>
              <li>
                Les projets &quot;unpublished&quot; ne sont pas visible aux
                visiteurs
              </li>
            </ul>
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
    fetcher,
  );

  const {
    data: tracks,
    error: tracksError,
    isLoading: tracksIsLoading,
  } = useSWR(
    !artistIsLoading && `/api/projects/${artist.uuid}/${uuid}/tracks`,
    fetcher,
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
