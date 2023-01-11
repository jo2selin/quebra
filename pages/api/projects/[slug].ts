import { GetItemCommand } from "@aws-sdk/client-dynamodb";
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
import { ddbClient } from "../../../libs/ddbClient.js";

import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/users/:userEmail
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // === GET ========================================
  if (req.method === "GET") {
    const data = await ddbClient.send(
      new GetItemCommand({
        TableName: process.env.TABLE,
        Key: marshall({ pk: "PROJECT", sk: req.query.slug }),
      })
    );

    if (!data.Item) {
      // profile does not exist yet
      return res.status(400).json({ error: "no data found" });
    } else {
      return res.status(200).json(unmarshall(data.Item));
    }
  }
}
