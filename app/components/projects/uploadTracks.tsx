import React from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "../../libs/fetcher";
import { useSession } from "next-auth/react";
import AccessDenied from "../access-denied";
import { useS3Upload, getImageData } from "next-s3-upload";
import slugify from "slugify";
import { useSWRConfig } from "swr";
import Info from "components/me/info";
import Button from "components/button";
interface TypeUpload {
  project: Project;
  artist: Artist;
}

function cleanTrackName(name: string) {
  let newName = name.split(".").slice(0, -1);
  // newName = typeof +newName[0] === "number" ? newName.slice(1) : newName;
  return slugify(newName.join(" "), { lower: true, strict: true });
}

export default function UploadTracks({ project, artist }: TypeUpload) {
  let { FileInput, openFileDialog, uploadToS3, files } = useS3Upload();
  const [urls, setUrls] = React.useState([]);
  const { mutate } = useSWRConfig();

  const handleFilesChange = async ({ target }: any) => {
    const files = Array.from(target.files);

    try {
      for (let index = 0; index < files.length; index++) {
        const file = files[index] as File;

        if (file.type !== "audio/mpeg") {
          throw new Error(`must be an mp3 : ${file.name}`);
          // console.error(`must be an mp3 : ${file.name}`);
        }

        const trackName = cleanTrackName(file.name);

        await uploadToS3(file, {
          endpoint: {
            request: {
              body: {
                path_s3: project.path_s3,
                trackName: trackName,
              },
              headers: {},
            },
          },
        }).then(async (track) => {
          const url = track.url;
          setUrls((current): any => [...current, url]);
          // setImageUrl(image.url + "?" + Date.now());

          try {
            const body = {
              track: track,
              trackName: trackName,
              track_id: index + 1,
              a_uuid: artist.uuid,
              p_uuid: project.uuid,
            };
            await fetch(`/api/projects/${artist.uuid}/${project.uuid}/tracks`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            mutate(`/api/projects/${artist.uuid}/${project.uuid}/tracks`);
          } catch (error) {
            console.error(error);
          }
        });
      }
    } catch (e) {
      // console.error(e);

      throw new Error(`${e}`);
    }
  };

  return (
    <>
      <div className="mt-12">
        <label className="mx-auto inline-block cursor-pointer rounded-md  border-b-4 border-jam-green-dark bg-jam-green px-6 py-3 text-xl leading-none text-white transition-transform hover:scale-105 hover:text-white">
          Envoyer .mp3s
          <input
            type="file"
            name="file"
            multiple={true}
            onChange={handleFilesChange}
            className="hidden"
          />
        </label>
        <div>
          {/* {urls.map((url, index) => {

            return (
              <div key={url}>
                File {index}: ${url}
              </div>
            );
          })} */}
        </div>
        <div className="flex flex-wrap">
          <div className=" w-full md:w-2/4 md:flex-1">
            {files[0] && <p className="pt-12">Avancement de l&apos;upload</p>}
            {files.map((file, index) => {
              return (
                <div
                  key={index}
                  className="justify-left mt-3 flex items-center align-middle"
                >
                  {/* <div className="w-10 mr-5 p-6 text-3xl">{index}</div> */}
                  <div className="w-full">
                    <p className=" w-22 h-6 overflow-x-auto overflow-y-hidden	 bg-jam-dark-grey px-2 py-1 font-mono  text-xs text-gray-400">
                      <span className="text-jam-pink"> {file.progress}% </span>-{" "}
                      {file.file.name}
                    </p>
                    <div
                      className="h-0.5 bg-jam-pink text-center"
                      style={{ width: file.progress + "%" }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          {files[0] && (
            <div className=" mt-5 md:ml-10 md:mt-20 md:flex-1 ">
              <Info type={"info"}>
                <p>
                  Il est impossible de rajouter des mp3 ou d'editer la cover
                  apres avoir publié le projet
                </p>
              </Info>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
