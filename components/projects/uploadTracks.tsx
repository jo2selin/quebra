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
    console.log("target", target);

    for (let index = 0; index < files.length; index++) {
      const file = files[index] as File;
      const trackName = cleanTrackName(file.name);
      console.log("final trackName track", trackName);

      await uploadToS3(file, {
        endpoint: {
          request: {
            body: { p_uuid: project.uuid, trackName: trackName },
            headers: {},
          },
        },
      }).then(async (track) => {
        console.log("track", track);
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
            console.log(url, index);

            return (
              <div key={url}>
                File {index}: ${url}
              </div>
            );
          })} */}
        </div>
        <div>
          {files[0] && <p className="pt-12">Files just added :</p>}
          {files.map((file, index) => {
            return (
              <div
                key={index}
                className="flex mt-3 align-middle justify-center items-center"
              >
                <div className="w-10 mr-5 p-6 text-3xl">{index}</div>
                <div className="w-full">
                  <p className=" bg-jam-dark-grey p-6">{file.file.name}</p>
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
