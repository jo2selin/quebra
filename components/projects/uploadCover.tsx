import React from "react";
import { useS3Upload, getImageData } from "next-s3-upload";
import Image from "next/image";

function checkImageParams(
  setErrorImage: Function,
  errorImage: string,
  width: number | undefined,
  height: number | undefined,
  size: number | undefined,
  type: string | undefined
) {
  setErrorImage(false); //reset for 2nd atempt
  if (
    width === undefined ||
    height === undefined ||
    size === undefined ||
    type === undefined
  ) {
    setErrorImage("Error with image width,height,size or type");
    return false;
  }

  // throw new Error("Image error");

  if (width >= 1100) {
    setErrorImage("Image is too big, use squoosh.app");
    return false;
  }
  if (width != height) {
    setErrorImage("Image should be square, use squoosh.app");
    return false;
  }
  if (size >= 2048000) {
    setErrorImage("Image weight too much, use squoosh.app");
    return false;
  }

  // console.log("errorImage", errorImage);
  if (errorImage) {
    return false;
  } else {
    return true;
  }
}

interface TypeUpload {
  project: Project;
  artist: Artist;
  status: String;
  setCoverIsSet: Function;
}

export default function UploadCover({
  project,
  artist,
  status,
  setCoverIsSet,
}: TypeUpload) {
  let [imageUrl, setImageUrl] = React.useState(
    project.cover &&
      `https://quebra-bucket.s3.eu-west-1.amazonaws.com/projects/${project.path_s3}/cover.${project.cover}`
  );
  let [height, setHeight] = React.useState(400);
  let [width, setWidth] = React.useState(400);
  let [errorImage, setErrorImage] = React.useState(false) as any;
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  const uploadImage = async (file: any) => {
    return await uploadToS3(file, {
      endpoint: {
        request: {
          body: { path_s3: project.path_s3, coverName: "cover" },
          headers: {},
        },
      },
    });
  };

  let handleFileChange = async (file: any) => {
    let { height, width } = await getImageData(file);
    width && setWidth(width);
    height && setHeight(height);

    const imageIsOk = checkImageParams(
      setErrorImage,
      errorImage,
      width,
      height,
      file.size,
      file.type
    );

    if (!imageIsOk) return false;

    try {
      uploadImage(file).then(async (image) => {
        setImageUrl(image.url + "?" + Date.now());
        setCoverIsSet(true);

        const body = { cover: true };
        await fetch(
          `/api/projects/${artist.uuid}/${project.uuid}/cover?key=${image.key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      });
    } catch (error) {
      console.error(error);
    }
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
          <Image
            src={imageUrl + "?" + Date.now()}
            width={width}
            height={height}
            alt=""
          />
        )}
      </div>
      {!imageUrl && <p>Add a cover</p>}
      {errorImage && <p className="text-red-600">{errorImage}</p>}
      {(imageUrl && status === "DRAFT") ||
        (status === "UNPUBLISHED" && (
          <p onClick={openFileDialog} className="cursor-pointer">
            Edit cover
          </p>
        ))}
    </>
  );
}
