import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req, res) {
  const reqBody = JSON.parse(req.body);

  const s3client = new S3Client({
    region: process.env.S3_UPLOAD_REGION,
    credentials: {
      accessKeyId: process.env.S3_UPLOAD_KEY,
      secretAccessKey: process.env.S3_UPLOAD_SECRET,
    },
  });
  const command = new GetObjectCommand({
    Bucket: process.env.S3_UPLOAD_BUCKET,
    Key: `projects/${reqBody.path_s3}/${reqBody.path_s3}.zip`,
  });

  const url = await getSignedUrl(s3client, command, {
    expiresIn: 1200,
  });
  return res.status(200).json({ url });
}
