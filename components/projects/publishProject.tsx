import React, { useState } from "react";
import { cssButtonPrimary } from "../../libs/css";

interface TypePublishProject {
  project: Project;
  artist: Artist;
  setLoadingPublish?: Function;
  setStatusLocal?: Function;
  allowedDownload?: boolean;
}

function PublishProject({ publishingProject }: any) {
  const {
    artist,
    project,
    setLoadingPublish,
    setStatusLocal,
    allowedDownload,
    loadingPublish,
  } = publishingProject;

  const [error, setError] = useState<string | null>(null);

  async function publishProject({
    artist,
    project,
    setLoadingPublish,
    setStatusLocal,
    allowedDownload,
  }: TypePublishProject) {
    try {
      if (setLoadingPublish) setLoadingPublish(true);
      const resPostProject = await fetch(
        `/api/projects/${artist.uuid}/${project.uuid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actualStatus: project.status,
            a_slug: artist.slug,
            p_slug: project.slug,
            path_s3: project.path_s3,
            allow_download: allowedDownload,
          }),
        },
      );

      if (!resPostProject.ok) {
        console.log(resPostProject);
        setError("Error posting project");
        if (setLoadingPublish) setLoadingPublish(false);
        throw new Error("Error posting project");
      }
      const res = await resPostProject.json();

      res.then((res: any) => {
        console.log("res publishProject", res);

        if (setLoadingPublish && setStatusLocal) {
          setStatusLocal("PUBLISHED");
          setLoadingPublish(false);
        }
      });
    } catch (error) {
      // setVisibleForm(true);
      console.error(error);
      return error;
    }
  }

  if (error) {
    return (
      <div className=" m-16 inline justify-center rounded-md border border-red-500 bg-red-200 px-8 py-3 text-sm  text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="m-16 flex justify-center">
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
  );
}

export default PublishProject;
