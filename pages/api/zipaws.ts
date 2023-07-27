import archiver from "archiver";
import * as AWS from "aws-sdk";
import stream from "node:stream";
import path from "node:path";
import { PutObjectCommand, S3Client, S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const archiveStream = archiver("zip");

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
const ARCHIVE_KEY = "macoverZipAws.zip" as string;
const OBJECT_KEYS = ["projects/tabomyeah-trid/cover.jpg"];

const passthrough = new stream.PassThrough();

const uploadTask = new Promise((resolve) => {
  s3.upload(
    {
      Bucket: TARGET_BUCKET_NAME,
      Key: ARCHIVE_KEY,

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

export default function handler(req, res) {
  archiveStream.on("error", (error) => {
    console.error("Archival encountered an error:", error);
    throw new Error("error", error);
  });

  archiveStream.pipe(passthrough);

  async function throwFilesIn() {
    for (const key of OBJECT_KEYS) {
      const params = { Bucket: SOURCE_BUCKET_NAME, Key: key };
      const response = await s3.getObject(params).promise();
      console.log("== response OBJECT KEY file :", response);
      // console.log("== response.Body :", response.Body);
      console.log("path.basename(key)", { name: path.basename(key) });

      // :: `response.Body` is a Buffer
      archiveStream.append(response.Body as Buffer, {
        name: path.basename(key),
      });
    }

    // :: When all the files have been added, then we can
    //    finalize the archive stream. This eventually closes
    //    the stream, and subsequently closes the passthrough
    //    stream we created in the upload task.
    archiveStream.finalize();
  }

  throwFilesIn()
    .then(async () => {
      // :: Remember that this task resolves only when the
      //    passthrough stream closes, and the passthrough
      //    stream closes only when the archive stream
      //    (that is piping into it) closes too.
      //
      //    When we finalize the archive stream, pretty much
      //    everything else collapses, and this resolves.
      const [BUCKET_NAME, OBJECT_KEY] = await uploadTask;
      // :: Now we can do whatever we want with this.
      //    How about we generate a presigned URL?
      const params = {
        Bucket: BUCKET_NAME,
        Key: OBJECT_KEY,
        Expires: 60 * 60 * 24, // :: 24 hours
      };
      const url = await s3.getSignedUrlPromise("getObject", params);
      console.log(url);
    })
    .then(res.status(200).json({ res: "cool" }));
}
