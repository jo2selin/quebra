const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Set your AWS region and credentials here
const AWS_REGION = process.env.S3_UPLOAD_REGION;
const AWS_ACCESS_KEY = process.env.S3_UPLOAD_KEY;
const AWS_SECRET_KEY = process.env.S3_UPLOAD_SECRET;

// Set the S3 bucket and object key where you want to upload the stream
const BUCKET_NAME = process.env.S3_UPLOAD_BUCKET;
const OBJECT_KEY = "fav.png";

async function uploadStreamToS3(stream) {
  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
    },
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: OBJECT_KEY,
    Body: stream,
  };

  const command = new PutObjectCommand(params);

  try {
    const response = await s3Client.send(command);
    console.log("Upload successful:", response);
  } catch (error) {
    console.error("Error uploading the stream:", error);
  }
}

// Example usage:
const fs = require("fs");

// Replace "your-file-path" with the actual path to the file you want to upload
const filePath = "fav.png";
const stream = fs.createReadStream(filePath);

export default function handler(req, res) {
  try {
    uploadStreamToS3(stream).then(res.status(200).json({ res: "done" }));
  } catch (error) {}
}
