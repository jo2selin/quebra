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

import type { NextApiRequest, NextApiResponse } from "next";

async function deleteTrack(
  p_uuid: string,
  t_uuid: string,
  slug: string,
  path_s3: string,
) {
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
    Key: `projects/${path_s3}/${slug}.mp3`,
  };
  await ddbDocClient.send(new DeleteCommand(params)).then(() => {
    try {
      const data = s3Client.send(new DeleteObjectCommand(bucketParams));
      // console.log("Success. Object deleted.", data);
      return data; // For unit tests.
    } catch (err) {
      console.error("Error DeleteCommand deleteTrack", err);
    }
  });
}

// GET /api/projects/:uuid
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // === GET ========================================
  if (req.method === "GET") {
    const project = await ddbDocClient.send(
      // new QueryCommand(paramsProjectFromUuid)
      new GetCommand({
        TableName: process.env.TABLE,
        Key: { pk: "PROJECT", sk: req.query.a_uuid + "#" + req.query.p_uuid },
      }),
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
    const status = req.body?.unpublish ? "UNPUBLISHED" : "PUBLISHED";
    const allow_download = req.body?.allow_download;

    // Publishing Project
    if (session && session.user?.email && req.method === "POST") {
      // console.log("PUBLISH PROJECT", req.query, status);

      console.log("POST UPDATE puuid =========================", req.query);
      const params = {
        TableName: process.env.TABLE,

        Key: {
          pk: "PROJECT",
          sk: req.query.a_uuid + "#" + req.query.p_uuid, // For example,  'Episode': 1; (only required if table has sort key).
        },
        ExpressionAttributeNames: {
          "#status": "status",
        },
        UpdateExpression: "set #status = :s, allow_download = :a", // For example, "'set Title = :t, Subtitle = :s'"
        ExpressionAttributeValues: {
          ":s": status,
          ":a": allow_download,
        },
        ReturnValues: "ALL_NEW" as const,
      };
      // console.log(params);
      const data = await ddbDocClient.send(new UpdateCommand(params));

      if (!req.body?.unpublish && req.body?.actualStatus === "DRAFT") {
        // create zip only on first publish
        //Todo re-create zip when tracks are edited/deleted

        try {
          // fetch files in the s3
          const response = await fetch(
            `${server}/api/projects/${req.query.a_uuid}/${req.query.p_uuid}/s3/s3-content`,
            {
              method: "POST",
              body: JSON.stringify({
                path_s3: req.body.path_s3,
              }),
            },
          );
          if (!response.ok) {
            throw new Error("No content found in folder");
          }
          const { res: filesToZip } = await response.json();

          // zip the files
          const responseZip = await fetch(
            `${server}/api/projects/${req.query.a_uuid}/${req.query.p_uuid}/s3/zipaws`,
            {
              method: "POST",
              body: JSON.stringify({
                path_s3: req.body.path_s3,
                filesToZip,
              }),
            },
          );
          if (!responseZip.ok) {
            throw new Error("Error creating zip file");
          }

          const data = await ddbDocClient.send(new UpdateCommand(params));
          if (!data) throw new Error("Error publishing status");
        } catch (error: any) {
          // throw error;
          return res.status(500).json({ error: error.message });
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
      return false;
    }

    const artistSession = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.TABLE,
        Key: { pk: "ARTIST", sk: session.user?.email },
      }),
    );

    if (artistSession.Item?.uuid !== req.query.a_uuid) {
      console.error("artistSession does not match artist project");
      return false;
    }

    const paramsAllTracksFromProject = {
      TableName: process.env.TABLE,
      KeyConditionExpression: "pk = :pk and begins_with(sk, :p_uuid)",
      ExpressionAttributeValues: {
        ":pk": "TRACK",
        ":p_uuid": req.query.p_uuid,
      },
    };

    //  TODO check que lemail correspond a la tape avant de supprimer ?!

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
          deleteTrack(
            req.query.p_uuid as string,
            track.uuid,
            track.slug,
            req.body.path_s3,
          );
        });
      })
      .then(async () => {
        const bucketParams = {
          Bucket: process.env.S3_UPLOAD_BUCKET,
          Key: `projects/${req.body.path_s3}/${req.body.slug}.zip`,
        };
        try {
          const data = await s3Client.send(
            new DeleteObjectCommand(bucketParams),
          );
          return data;
        } catch (err) {
          console.error("Error DeleteObjectCommand", err);
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
          ReturnValues: "ALL_NEW" as const,
        };
        try {
          const data = await ddbDocClient.send(new UpdateCommand(params));
          return data;
        } catch (err) {
          console.error("err set Project status to DELETE", err);

          throw new Error("err set Project status to DELETE");
        }
      });
    return res.status(200).json(data);
  }
}
