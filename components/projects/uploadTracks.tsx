import React from "react";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "../../libs/fetcher";
import { useSession } from "next-auth/react";
import AccessDenied from "../access-denied";
import { useS3Upload, getImageData } from "next-s3-upload";
import slugify from "slugify";

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

  const handleFilesChange = async ({ target }: any) => {
    const files = Array.from(target.files);
    // console.log("target", target);

    try {
      for (let index = 0; index < files.length; index++) {
        const file = files[index] as File;

        if (file.type !== "audio/mpeg") {
          throw new Error(`must be an mp3 : ${file.name}`);
          // console.error(`must be an mp3 : ${file.name}`);
        }

        const trackName = cleanTrackName(file.name);
        console.log("final trackName track", trackName);
        console.log(files[index]);

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
        <input
          type="file"
          name="file"
          multiple={true}
          onChange={handleFilesChange}
        />
        <div>
          {/* {urls.map((url, index) => {

            return (
              <div key={url}>
                File {index}: ${url}
              </div>
            );
          })} */}
        </div>
        <div>
          {files[0] && <p className="pt-12">Fichiers récemment ajoutés :</p>}
          {files.map((file, index) => {
            return (
              <div
                key={index}
                className="flex mt-3 align-middle justify-left items-center"
              >
                {/* <div className="w-10 mr-5 p-6 text-3xl">{index}</div> */}
                <div className="w-full md:w-2/6">
                  <p className=" bg-jam-dark-grey px-6 py-4">
                    {file.file.name}
                  </p>
                  <div
                    className="h-1 bg-jam-pink text-center"
                    style={{ width: file.progress + "%" }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
