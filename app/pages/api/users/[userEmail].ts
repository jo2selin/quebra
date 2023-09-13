import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../libs/ddbDocClient";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/users/:userEmail
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || session.user?.email !== req.query.userEmail) {
    return res.send({
      error: "You must be signed in to access this route.",
    });
  }
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
