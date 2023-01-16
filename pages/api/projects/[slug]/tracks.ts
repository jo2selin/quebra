import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../../libs/ddbDocClient";

import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/projects/:slug
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const paramsAllTracksFromProject = {
    TableName: process.env.TABLE,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `TRACK#${req.query.slug}`,
    },
    ProjectionExpression: "pk, sk, track_name, track_url",
  };

  // === GET ========================================
  if (req.method === "GET") {
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
}
