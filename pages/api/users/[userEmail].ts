import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../libs/ddbDocClient";

import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/users/:userEmail
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // === GET ========================================
  if (req.method === "GET") {
    const data = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.TABLE,
        Key: { pk: "ARTIST", sk: req.query.userEmail },
      })
    );

    if (!data.Item) {
      // profile does not exist yet
      return res.status(400).json({ error: "no data found" });
    } else {
      return res.status(200).json(data.Item);
    }
  }
}
