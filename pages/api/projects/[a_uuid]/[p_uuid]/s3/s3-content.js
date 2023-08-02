import {
  S3Client,
  // This command supersedes the ListObjectsCommand and is the recommended way to list objects.
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { error } from "console";

function filterFileType(fileArray) {
  const allowedExtensions = [".jpg", ".png", ".mp3"];

  // Filter the fileArray based on the file extension
  const filteredArray = fileArray.filter((filename) => {
    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      const fileExtension = filename.slice(lastDotIndex).toLowerCase();
      return allowedExtensions.includes(fileExtension);
    }
    return false;
  });

  return filteredArray;
}

export default async function handler(req, res) {
  // console.log("req.body", req.body);

  const client = new S3Client({
    region: process.env.S3_UPLOAD_REGION,
    credentials: {
      accessKeyId: process.env.S3_UPLOAD_KEY,
      secretAccessKey: process.env.S3_UPLOAD_SECRET,
    },
  });

  const main = async (reqBody) => {
    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_UPLOAD_BUCKET,
      // The default and maximum number of keys returned is 1000. This limits it to
      // one for demonstration purposes.
      MaxKeys: 1,
      Prefix: "projects/" + reqBody.path_s3,
    });

    // const command = new ListObjectsV2Command(input);
    // const response = await client.send(command);
    // console.log("response", response);
    let isTruncated = true;
    let contentFolder = [];

    console.log("Your bucket contains the following objects:\n");

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await client.send(command);
      console.log("Contents", Contents);
      if (!Contents) throw new Error("Contents error");
      contentFolder = [...contentFolder, Contents[0].Key];
      // const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
      // contents += contentsList + "\n";
      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }
    console.log("contentFolder", contentFolder);
    const filteredFiles = filterFileType(contentFolder);
    return filteredFiles;
  };

  try {
    if (!req.body) {
      throw new Error("empty body");
    }
    const reqBody = JSON.parse(req.body);

    const result = await main(reqBody);
    res.status(200).json({ res: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
