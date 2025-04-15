import archiver from "archiver";
import stream from "node:stream";
import path from "node:path";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

// Environment variables
const TARGET_BUCKET_NAME = process.env.S3_UPLOAD_BUCKET as string;
const SOURCE_BUCKET_NAME = process.env.S3_UPLOAD_BUCKET as string;

// AWS S3 client
const s3Client = new S3Client({
  region: process.env.S3_UPLOAD_REGION,
});

// Archiver and passthrough stream
const archiveStream = archiver("zip");
const passthrough = new stream.PassThrough();

/**
 * Handles the upload of the zip file to S3.
 */
const uploadTask = async (archiveKey: string): Promise<[string, string]> => {
  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: TARGET_BUCKET_NAME,
        Key: `projects/${archiveKey}`,
        Body: passthrough,
        ContentType: "application/zip",
      },
    });

    upload.on("httpUploadProgress", (progress) => {
      console.log("Upload progress:", progress);
    });

    await upload.done();
    console.log("Zip uploaded.");
    return [TARGET_BUCKET_NAME, archiveKey];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Upload error:", error.message);
      throw new Error("Upload failed: " + error.message);
    } else {
      console.error("Unknown upload error:", error);
      throw new Error("Upload failed due to an unknown error.");
    }
  }
};

/**
 * Fetches files from S3 and appends them to the archive stream.
 */
const throwFilesIn = async (objectKeys: string[]): Promise<void> => {
  for (const key of objectKeys) {
    const params = { Bucket: SOURCE_BUCKET_NAME, Key: key };
    try {
      const response = await s3Client.send(new GetObjectCommand(params));
      if (response.Body) {
        archiveStream.append(response.Body as stream.Readable, {
          name: path.basename(key),
        });
      } else {
        console.error(`No body found for key: ${key}`);
      }
    } catch (error) {
      console.error("Error fetching object:", error);
      throw new Error(`Error fetching object: ${key}`);
    }
  }

  // Finalize the archive stream after adding all files
  archiveStream.finalize();
};

/**
 * API handler for zipping and uploading files to S3.
 */
export default async function handler(req: any, res: any): Promise<void> {
  try {
    // Parse request body
    const reqBody = JSON.parse(req.body);
    console.log("====filesToZip", reqBody.filesToZip);

    // Validate input
    if (!reqBody.filesToZip || !Array.isArray(reqBody.filesToZip)) {
      throw new Error("No files to zip or invalid format");
    }

    const archiveKey = `${reqBody.path_s3}/${reqBody.path_s3}.zip`;
    const objectKeys = reqBody.filesToZip;

    // Handle archive stream errors
    archiveStream.on("error", (error) => {
      console.error("Archival encountered an error:", error);
      throw new Error("Archival error: " + error.message);
    });

    // Pipe the archive stream to the passthrough stream
    archiveStream.pipe(passthrough);

    // Process files and upload the archive
    await throwFilesIn(objectKeys);
    const [bucketName, objectKey] = await uploadTask(archiveKey);

    // Respond with success
    res.status(200).json({ bucket: bucketName, key: objectKey });
  } catch (error: any) {
    console.error("Handler error:", error);
    res.status(500).json({ error: error.message });
  }
}
