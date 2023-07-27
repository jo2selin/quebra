import archiver from "archiver";
import * as AWS from "aws-sdk";
import stream from "node:stream";
import path from "node:path";
import { PutObjectCommand, S3Client, S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
// declare let S3_UPLOAD_BUCKET: string;
// declare let ARCHIVE_KEY: string;
// declare let SOURCE_BUCKET_NAME: string;
// declare let OBJECT_KEYS: string[];
// :: ---

export default function handler(req, res) {
  let S3_UPLOAD_BUCKET = process.env.S3_UPLOAD_BUCKET as string;
  let SOURCE_BUCKET_NAME = process.env.S3_UPLOAD_BUCKET as string;
  let OBJECT_KEYS = "projects/96f7d-tabom-2321312/cover.jpg";

  const archiveStream = archiver("zip");

  const client = new S3Client({
    region: process.env.S3_UPLOAD_REGION,
    credentials: {
      accessKeyId: process.env.S3_UPLOAD_KEY as string,
      secretAccessKey: process.env.S3_UPLOAD_SECRET as string,
    },
  });

  console.log("S3_UPLOAD_BUCKET", S3_UPLOAD_BUCKET);

  archiveStream.on("error", (error) => {
    console.error("Archival encountered an error:", error);
    throw new Error(error as any);
  });

  const s3 = new AWS.S3({
    httpOptions: {
      timeout: 60 * 8 * 1000, // :: 8 minutes
    },
  });

  const passthrough = new stream.PassThrough();

  // const mainV3 = async (passthroughM: any) => {
  //   const command = new PutObjectCommand({
  //     Bucket: process.env.S3_UPLOAD_BUCKET,
  //     Region: process.env.S3_UPLOAD_REGION,
  //     Key: OBJECT_KEYS,
  //     Body: passthrough,
  //   });

  //   try {
  //     const response = await client.send(command);
  //     console.log(response);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // :: We wrap this in a promise so we have something to await.
  const uploadTask = new Promise((resolve) => {
    console.log("begening upload task");

    // mainV3(passthrough).then((a) => resolve([S3_UPLOAD_BUCKET, ARCHIVE_KEY]));
    const target = {
      Bucket: process.env.S3_UPLOAD_BUCKET,
      Key: OBJECT_KEYS,
      Body: passthrough,
    };

    const myAsync = async () => {
      const parallelUploads3 = new Upload({
        client: new S3Client({
          region: process.env.S3_UPLOAD_REGION,
          credentials: {
            accessKeyId: process.env.S3_UPLOAD_KEY as string,
            secretAccessKey: process.env.S3_UPLOAD_SECRET as string,
          },
        }),
        // tags: [...], // optional tags
        queueSize: 4, // optional concurrency configuration
        leavePartsOnError: false, // optional manually handle dropped parts
        params: target,
      });

      parallelUploads3.on("httpUploadProgress", (progress) => {
        console.log("progress", progress);
      });

      await parallelUploads3.done();
    };

    try {
      console.log("trying MyAsync");

      myAsync();
      resolve([S3_UPLOAD_BUCKET, ARCHIVE_KEY]);
    } catch (e) {
      console.log("ERR uploadTask", e);
    }

    // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
    // Please convert to `await client.upload(params, options).promise()`, and re-run aws-sdk-js-codemod.
    // s3.upload(
    //   {
    //     Bucket: S3_UPLOAD_BUCKET,
    //     Key: ARCHIVE_KEY,

    //     Body: passthrough,
    //     ContentType: "application/zip",
    //   }, // :: This callback fires when the stream is closed.
    //   //    As you can see, we're just resolving the promise here,
    //   //    so whatever awaits this is notified.
    //   () => {
    //     console.log("End of  upload task, Zip uploaded.");
    //     resolve([S3_UPLOAD_BUCKET, ARCHIVE_KEY]);
    //   }
    // );
  });

  archiveStream.pipe(passthrough);

  const f1 = async () => {
    for (const key of OBJECT_KEYS) {
      console.log("key:", key);

      const params = { Bucket: SOURCE_BUCKET_NAME, Key: key };
      console.log(params);

      const response = await s3.getObject(params).promise();
      console.log("response", response);
      // console.log("f1 archiveStream", archiveStream);

      // :: `response.Body` is a Buffer
      archiveStream.append(response.Body, path.basename(key));
    }

    // :: When all the files have been added, then we can
    //    finalize the archive stream. This eventually closes
    //    the stream, and subsequently closes the passthrough
    //    stream we created in the upload task.
    archiveStream.finalize();
  };

  const lastStep = async () => {
    // :: Remember that this task resolves only when the
    //    passthrough stream closes, and the passthrough
    //    stream closes only when the archive stream
    //    (that is piping into it) closes too.
    //
    //    When we finalize the archive stream, pretty much
    //    everything else collapses, and this resolves.
    console.log("start last step");
    // console.log("prmise", await uploadTask);

    // const [BUCKET_NAME, OBJECT_KEY]: any = await uploadTask;

    // :: Now we can do whatever we want with this.
    //    How about we generate a presigned URL?
    // const params = {
    //   Bucket: BUCKET_NAME,
    //   Key: OBJECT_KEY,
    //   Expires: 60 * 60 * 24, // :: 24 hours
    // };
    // console.log("params lasStep", params);

    // const url = await s3.getSignedUrlPromise("getObject", params);

    // res.status(200).json({ res: "Zip done: ", BUCKET_NAME, OBJECT_KEY });
    res.status(200).json({ res: "cool" });
  };

  try {
    f1().then((r) => {
      console.log("f1THEN");

      lastStep().then((i) => console.log("lastStep Then"));
    });
  } catch (error) {
    console.error(error);
  }
}
