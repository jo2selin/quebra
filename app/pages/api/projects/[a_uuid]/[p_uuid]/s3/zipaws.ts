import archiver from "archiver";
import * as AWS from "aws-sdk";
import stream from "node:stream";
import path from "node:path";
import {
  PutObjectCommand,
  S3Client,
  S3,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const archiveStream = archiver("zip");
const client = new S3Client({});
const s3 = new AWS.S3({
  httpOptions: {
    timeout: 60 * 10 * 1000, // :: 10 minutes
  },
});

// declare const TARGET_BUCKET_NAME: string;
// declare const ARCHIVE_KEY: string;
// declare const SOURCE_BUCKET_NAME: string;
// declare const OBJECT_KEYS: string[]
const TARGET_BUCKET_NAME = process.env.S3_UPLOAD_BUCKET as string;
const SOURCE_BUCKET_NAME = process.env.S3_UPLOAD_BUCKET as string;

// interface ResUpload : string[]

const passthrough = new stream.PassThrough();

export default async function handler(req: any, res: any) {
  const reqBody = JSON.parse(req.body);
  console.log("====filesToZip", reqBody.filesToZip);

  const ARCHIVE_KEY = `${reqBody.path_s3}/${reqBody.path_s3}.zip` as string;
  const OBJECT_KEYS = reqBody.filesToZip;

  archiveStream.on("error", (error) => {
    console.error("Archival encountered an error:", error);
    throw new Error("error", error);
  });

  archiveStream.pipe(passthrough);

  const uploadTask = new Promise((resolve) => {
    s3.upload(
      {
        Bucket: TARGET_BUCKET_NAME,
        Key: "projects/" + ARCHIVE_KEY,

        Body: passthrough,
        ContentType: "application/zip",
      },

      // :: This callback fires when the stream is closed.
      //    As you can see, we're just resolving the promise here,
      //    so whatever awaits this is notified.
      () => {
        console.log("Zip uploaded.");
        resolve([TARGET_BUCKET_NAME, ARCHIVE_KEY]);
      }
    );
  });

  const awaitUpload = async () => {
    const [BUCKET_NAME, OBJECT_KEY]: any = await uploadTask;
    return [BUCKET_NAME, OBJECT_KEY];
  };

  async function throwFilesIn() {
    for (const key of OBJECT_KEYS) {
      const params = { Bucket: SOURCE_BUCKET_NAME, Key: key };
      try {
        const response = await s3.getObject(params).promise();
        // console.log("response", response);
        // console.log("key", key);

        archiveStream.append(response.Body as Buffer, {
          name: path.basename(key),
        });
      } catch (error) {
        res.json({ res: error });
      }

      // if (!response) {
      // }
      // :: `response.Body` is a Buffer
    }

    // :: When all the files have been added, then we can
    //    finalize the archive stream. This eventually closes
    //    the stream, and subsequently closes the passthrough
    //    stream we created in the upload task.
    archiveStream.finalize();
  }

  try {
    if (!reqBody.filesToZip) throw new Error("No files to zip");

    const result = throwFilesIn().then((r) => {
      awaitUpload();
    });
    return res.status(200).json({ result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
