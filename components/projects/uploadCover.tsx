import React from "react";
import { useS3Upload, getImageData } from "next-s3-upload";
import Image from "next/image";

function checkImageParams(
  width: number | undefined,
  height: number | undefined,
  size: number | undefined,
  type: string | undefined
) {
  if (
    width === undefined ||
    height === undefined ||
    size === undefined ||
    type === undefined
  )
    throw new Error("Image error");

  if (width >= 1100) throw new Error("Image is too big");
  if (width != height) throw new Error("Image should be square");
  if (size >= 2048000) throw new Error("Image weight too much");
  return;
}

interface TypeUpload {
  project: Project;
  artist: Artist;
  status: String;
}

export default function UploadCover({ project, artist, status }: TypeUpload) {
  let [imageUrl, setImageUrl] = React.useState(
    project.cover &&
      `https://quebra-bucket.s3.eu-west-1.amazonaws.com/projects/${project.path_s3}/cover.${project.cover}`
  );
  let [height, setHeight] = React.useState(400);
  let [width, setWidth] = React.useState(400);
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  let handleFileChange = async (file: any) => {
    let { height, width } = await getImageData(file);

    checkImageParams(width, height, file.size, file.type);
    width && setWidth(width);
    height && setHeight(height);

    await uploadToS3(file, {
      endpoint: {
        request: {
          body: { path_s3: project.path_s3, coverName: "cover" },
          headers: {},
        },
      },
    }).then(async (image) => {
      console.log("prject", project);
      console.log("image", image);

      setImageUrl(image.url + "?" + Date.now());

      try {
        const body = { cover: true };
        await fetch(
          `/api/projects/${artist.uuid}/${project.uuid}/cover?key=${image.key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-center w-48 h-48 bg-jam-light-transparent">
        <FileInput onChange={handleFileChange} />
        {!imageUrl && (
          <button onClick={openFileDialog}>
            <p className="text-8xl">+</p>
          </button>
        )}
        {imageUrl && (
          <Image src={imageUrl} width={width} height={height} alt="" />
        )}
      </div>
      {imageUrl && status === "DRAFT" && (
        <p onClick={openFileDialog} className="cursor-pointer">
          Edit cover
        </p>
      )}
    </>
  );
}
