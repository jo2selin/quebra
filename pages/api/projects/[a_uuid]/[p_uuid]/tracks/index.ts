import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../../../../libs/ddbDocClient";

import type { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]";

// GET /api/projects/:a_uuid/:p_uuid/tracks/
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  // === GET ========================================
  if (req.method === "GET") {
    const paramsAllTracksFromProject = {
      TableName: process.env.TABLE,
      KeyConditionExpression: "pk = :pk and begins_with(sk, :p_uuid)",
      ExpressionAttributeValues: {
        ":pk": "TRACK",
        ":p_uuid": req.query.p_uuid,
      },
    };
    const data = await ddbDocClient.send(
      new QueryCommand(paramsAllTracksFromProject)
    );

    if (!data.Items) {
      // profile does not exist yet
      return res.status(400).json({ error: "no data found" });
    } else {
      return res.status(200).json(data.Items);
    }
  }

  // === POST ========================================

  if (req.method === "POST" && !session) {
    res.send({
      error: "You must be signed in to access this route.",
    });
  }

  if (session && session.user?.email && req.method === "POST") {
    console.log("req POST /tracks", req.body);

    const { trackName, p_uuid, track_id } = req.body;
    const uuid = uuidv4();

    const data = await ddbDocClient.send(
      new PutCommand({
        TableName: process.env.TABLE,
        Item: {
          pk: "TRACK",
          sk: p_uuid + "#" + uuid,
          slug: trackName,
          uuid: uuid,
          track_id: track_id,
          track_name: trackName,
        },
      })
    );

    return res.status(201).json(data);
  }
}
