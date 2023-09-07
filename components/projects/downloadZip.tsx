import React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
// import { s3Client } from "../../libs/s3Client.js";

interface TypeDownloadZip {
  path: string;
  path_s3: string;
}

export default function DownloadZip({ path, path_s3 }: TypeDownloadZip) {
  const { push } = useRouter();

  const handleDownload = async () => {
    try {
      const response = await fetch(`${path}/s3/zipSignedUrl`, {
        method: "POST",
        body: JSON.stringify({
          path_s3: path_s3,
        }),
      });
      const urlZip = await response.json();
      urlZip && push(urlZip.url as string);
    } catch (error) {
      console.error(error);
    }
    return;
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div
          className={`text-md mt-5 inline-block  cursor-pointer rounded-md border-b-4 border-jam-pink bg-jam-purple 
        px-4 py-2 leading-none text-white
        hover:text-white 
        `}
          onClick={handleDownload}
        >
          Télécharger .zip
        </div>
      </div>
    </>
  );
}
