import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../../../../libs/ddbDocClient";
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

  // === POST ========================================
  if (req.method === "POST") {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      res.send({
        error: "You must be signed in to access this route.",
      });
    }
    if (session && session.user?.email && req.method === "POST") {
      console.log("POST TRACK", req.query);

      const params = {
        TableName: process.env.TABLE,

        Key: {
          pk: "TRACK", // For example, 'Season': 2.
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
}
