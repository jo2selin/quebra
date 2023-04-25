import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req, res) {
  const s3client = new S3Client({
    region: process.env.S3_UPLOAD_REGION,
    credentials: {
      accessKeyId: process.env.S3_UPLOAD_KEY,
      secretAccessKey: process.env.S3_UPLOAD_SECRET,
    },
  });
  const command = new GetObjectCommand({
    Bucket: process.env.S3_UPLOAD_BUCKET,
    Key: "projects/tabomyeah-2104e/tabomyeah-2104e.zip",
  });

  const url = await getSignedUrl(s3client, command, {
    expiresIn: 20,
  });
  console.log("preSignedUrl", url);
  return res.status(200).json({ url });
}
