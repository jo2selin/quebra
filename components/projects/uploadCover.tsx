import React from "react";
import { useS3Upload, getImageData } from "next-s3-upload";
import Image from "next/image";

function checkImageParams(
  // setErrorImage: Function,
  // errorImage: string,
  width: number | undefined,
  height: number | undefined,
  size: number | undefined,
  type: string | undefined,
) {
  let errorParams = null;
  if (
    width === undefined ||
    height === undefined ||
    size === undefined ||
    type === undefined
  ) {
    errorParams = " Image erreur : largeur, hauteur, poid ou format";
  } else if (width >= 1100) {
    errorParams =
      "L'image est trop grande, utilisez squoosh.app pour la reduire";
  } else if (width != height) {
    errorParams = "L'image doit etre carrée, utilisez squoosh.app";
  } else if (size >= 2048000) {
    errorParams =
      "L'image pèse trop , utilisez squoosh.app pour reduire la qualité";
  }
  return errorParams;
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
      `https://quebra-bucket.s3.eu-west-1.amazonaws.com/projects/${project.path_s3}/cover.${project.cover}`,
  );
  let [height, setHeight] = React.useState(400);
  let [width, setWidth] = React.useState(400);
  // let [progress, setProgress] = React.useState();
  let [errorImage, setErrorImage] = React.useState(null) as any;
  let { FileInput, openFileDialog, uploadToS3, files } = useS3Upload();

  const uploadImage = async (file: any) => {
    console.log("uploadImage");

    // setProgress(file.progress)
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
    setErrorImage(null); // reset
    let { height, width } = await getImageData(file);
    width && setWidth(width);
    height && setHeight(height);

    const resCheckImage = checkImageParams(width, height, file.size, file.type);
    const imageIsOk = resCheckImage === null ? true : false;

    setErrorImage(resCheckImage);
    if (!imageIsOk) return false;

    try {
      uploadImage(file).then(async (image) => {
        console.log("uploadImage", image);

        setImageUrl(image.url + "?" + Date.now());
        setCoverIsSet(true);

        const body = { cover: true };
        await fetch(
          `/api/projects/${artist.uuid}/${project.uuid}/cover?key=${image.key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          },
        );
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex h-48 w-48 items-center justify-center bg-jam-light-transparent">
        <FileInput onChange={handleFileChange} />

        {!imageUrl && (
          <div className="flex flex-col">
            <button onClick={openFileDialog}>
              <p className="text-8xl">+</p>
              <p>
                Ajouter une cover carré<span>*</span>{" "}
              </p>
            </button>
          </div>
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
      {errorImage && <p className="text-red-600">{errorImage}</p>}
      {files[0] && files[0]?.progress !== 100 && (
        <p>cover: {files[0]?.progress} %</p>
      )}
      {imageUrl && status === "DRAFT" && (
        <p onClick={openFileDialog} className="cursor-pointer">
          Edit cover
        </p>
      )}
    </div>
  );
}
