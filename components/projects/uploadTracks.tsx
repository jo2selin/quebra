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
      <div className="mt-4">
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
        <div className="flex flex-wrap">
          <div className=" w-full md:w-2/4 md:flex-1">
            {files[0] && <p className="pt-12">Fichiers récemment ajoutés :</p>}
            {files.map((file, index) => {
              return (
                <div
                  key={index}
                  className="justify-left mt-3 flex items-center align-middle"
                >
                  {/* <div className="w-10 mr-5 p-6 text-3xl">{index}</div> */}
                  <div className="w-full">
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
          {files[0] && (
            <div className=" mt-12   w-full md:ml-10 md:flex-1 ">
              <div className=" rounded-xl border-4 border-jam-purple bg-jam-light-grey p-4 pl-6 font-serif lowercase text-jam-dark-purple">
                <ul className="list-disc">
                  <li className="pb-4">
                    Il est impossible de rajouter des mp3 ou d&apos;editer la
                    cover apres avoir publié le projet
                  </li>
                  <li>
                    Une fois tous vos mp3 envoyés, retounez sur &quot;mon
                    compte&quot; pour editer votre tracklist
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
