import {
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ddbDocClient } from "../../../../../../libs/ddbDocClient";
import { s3Client } from "../../../../../../libs/s3Client.js"; // Helper function that creates an Amazon S3 service client module.
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/projects/:slug
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // === GET ========================================
  // if (req.method === "GET") {
  //   const data = await ddbDocClient.send(
  //     new GetCommand({
  //       TableName: process.env.TABLE,
  //       Key: { pk: `TRACK#${req.query.slug}`, sk: req.query.trackSlug },
  //     })
  //   );

  //   if (!data.Item) {
  //     // profile does not exist yet
  //     return res.status(400).json({ error: "no data found" });
  //   } else {
  //     return res.status(200).json(data.Item);
  //   }
  // }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.send({
      error: "You must be signed in to access this route.",
    });
  }
  // === POST ========================================
  if (req.method === "POST") {
    if (session && session.user?.email && req.method === "POST") {
      console.log("POST TRACK", req.query);

      const params = {
        TableName: process.env.TABLE,

        Key: {
          pk: "TRACK",
          sk: req.query.p_uuid + "#" + req.query.t_uuid, // For example,  'Episode': 1; (only required if table has sort key).
        },
        // Define expressions for the new or updated attributes
        UpdateExpression: "set track_name = :t, track_id = :n", // For example, "'set Title = :t, Subtitle = :s'"
        ExpressionAttributeValues: {
          ":t": req.query.newTrackName,
          ":n": req.query.newTrackNumber,
        },
        ReturnValues: "ALL_NEW",
      };

      const data = await ddbDocClient.send(new UpdateCommand(params));

      return res.status(201).json(data);
    }
  }

  // === DELETE ========================================
  if (req.method === "DELETE") {
    console.log(
      "p_uuid, t_uuid, slug",
      req.query.p_uuid,
      req.query.t_uuid,
      req.query.slug
    );
    if (!req.query.slug) {
      throw new Error("Track slug not defined");
    }
    const params = {
      TableName: process.env.TABLE,
      Key: {
        pk: "TRACK",
        sk: req.query.p_uuid + "#" + req.query.t_uuid,
      },
    };
    const bucketParams = {
      Bucket: process.env.S3_UPLOAD_BUCKET,
      Key: `projects/${req.query.p_uuid}/${req.query.slug}.mp3`,
    };
    const data = await ddbDocClient.send(new DeleteCommand(params)).then(() => {
      try {
        const data = s3Client.send(new DeleteObjectCommand(bucketParams));
        console.log("Success. Object deleted.", data);
        return data; // For unit tests.
      } catch (err) {
        console.log("Error", err);
      }
    });
    return res.status(201).json(data);
  }
}
