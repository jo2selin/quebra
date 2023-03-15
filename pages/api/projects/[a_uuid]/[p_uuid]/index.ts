import {
  GetCommand,
  DeleteCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ddbDocClient } from "../../../../../libs/ddbDocClient";
import { s3Client } from "../../../../../libs/s3Client.js";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import { server } from "../../../../../config";

// import s3zipper from "./s3/s3-zipper";

import type { NextApiRequest, NextApiResponse } from "next";

async function deleteTrack(p_uuid: string, t_uuid: string, slug: string) {
  console.log("p_uuid, t_uuid, slug", p_uuid, t_uuid, slug);
  if (!slug) {
    throw new Error("Track slug not defined");
  }
  const params = {
    TableName: process.env.TABLE,
    Key: {
      pk: "TRACK",
      sk: p_uuid + "#" + t_uuid,
    },
  };
  const bucketParams = {
    Bucket: process.env.S3_UPLOAD_BUCKET,
    Key: `projects/${p_uuid}/${slug}.mp3`,
  };
  await ddbDocClient.send(new DeleteCommand(params)).then(() => {
    try {
      const data = s3Client.send(new DeleteObjectCommand(bucketParams));
      console.log("Success. Object deleted.", data);
      return data; // For unit tests.
    } catch (err) {
      console.log("Error", err);
    }
  });
}

// GET /api/projects/:uuid
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // === GET ========================================
  if (req.method === "GET") {
    console.log("req.query", req.query);

    const project = await ddbDocClient.send(
      // new QueryCommand(paramsProjectFromUuid)
      new GetCommand({
        TableName: process.env.TABLE,
        Key: { pk: "PROJECT", sk: req.query.a_uuid + "#" + req.query.p_uuid },
      })
    );

    if (!project.Item) {
      return res.status(400).json({ error: "no data found" });
    } else {
      return res.status(200).json(project.Item);
    }
  }

  // === POST ========================================
  if (req.method === "POST") {
    const session = await unstable_getServerSession(req, res, authOptions);
    console.log(req.body?.unpublished);
    const status = req.body?.unpublish ? "UNPUBLISHED" : "PUBLISHED";

    // Publishing Project
    if (session && session.user?.email && req.method === "POST") {
      console.log("PUBLISH PROJECT", req.query, status);

      const params = {
        TableName: process.env.TABLE,

        Key: {
          pk: "PROJECT",
          sk: req.query.a_uuid + "#" + req.query.p_uuid, // For example,  'Episode': 1; (only required if table has sort key).
        },
        ExpressionAttributeNames: {
          "#status": "status",
        },
        UpdateExpression: "set #status = :s", // For example, "'set Title = :t, Subtitle = :s'"
        ExpressionAttributeValues: {
          ":s": status,
        },
        ReturnValues: "ALL_NEW",
      };

      const data = await ddbDocClient.send(new UpdateCommand(params));

      if (!req.body?.unpublish && req.body?.actualStatus === "DRAFT") {
        // create zip only on first publish

        try {
          await fetch(
            `${server}/api/projects/${req.query.a_uuid}/${req.query.p_uuid}/s3/s3-zipper`,
            {
              method: "GET",
            }
          );
        } catch (error) {
          throw error;
        }
      }
      return res.status(201).json(data);
    }
  }

  // === DELETE ========================================
  if (req.method === "DELETE") {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      res.send({
        error: "You must be signed in to access this route.",
      });
    }

    const paramsAllTracksFromProject = {
      TableName: process.env.TABLE,
      KeyConditionExpression: "pk = :pk and begins_with(sk, :p_uuid)",
      ExpressionAttributeValues: {
        ":pk": "TRACK",
        ":p_uuid": req.query.p_uuid,
      },
    };

    const data = await ddbDocClient
      .send(new QueryCommand(paramsAllTracksFromProject))
      // .send(new DeleteCommand(paramsAllTracksFromProject))
      .then((tracks) => {
        if (!tracks.Items) {
          throw new Error("No tracks to delete");
        }
        if (!req.query.p_uuid) {
          throw new Error("p_uuid not defined");
        }
        tracks.Items.forEach((track) => {
          deleteTrack(req.query.p_uuid as string, track.uuid, track.slug);
        });
      })
      .then(async () => {
        const bucketParams = {
          Bucket: process.env.S3_UPLOAD_BUCKET,
          Key: `projects/${req.query.p_uuid}/`,
        };
        try {
          const data = await s3Client.send(
            new DeleteObjectCommand(bucketParams)
          );
          console.log("Success. Project deleted.", data);
          return data;
        } catch (err) {
          console.log("Error", err);
        }
      })
      .then(async () => {
        const params = {
          TableName: process.env.TABLE,
          Key: {
            pk: "PROJECT",
            sk: req.query.a_uuid + "#" + req.query.p_uuid,
          },
          // Define expressions for the new or updated attributes
          ExpressionAttributeNames: {
            "#status": "status",
          },
          UpdateExpression: "set #status = :s",
          ExpressionAttributeValues: {
            ":s": "DELETED",
          },
          ReturnValues: "ALL_NEW",
        };
        try {
          const data = await ddbDocClient.send(new UpdateCommand(params));
          return data;
        } catch (err) {
          console.error("err set Project status to DELETE", err);

          throw new Error("err set Project status to DELETE");
        }
      });
    return res.status(204).json(data);
  }
}
