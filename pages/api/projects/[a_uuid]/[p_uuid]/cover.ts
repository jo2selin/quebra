import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

import { ddbDocClient } from "../../../../../libs/ddbDocClient";

import type { NextApiRequest, NextApiResponse } from "next";
import { server } from "../../../../../config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //                  api/projects/a_uuid/p_uuid/cover
  // === POST ========================================
  if (req.method === "POST") {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      res.send({
        error: "You must be signed in to access this route.",
      });
    }
    if (session && session.user?.email && req.method === "POST") {
      const extension = (req.query.key as string).split(".").slice(-1);

      const params = {
        TableName: process.env.TABLE,

        Key: {
          pk: "PROJECT", // For example, 'Season': 2.
          sk: req.query.a_uuid + "#" + req.query.p_uuid, // For example,  'Episode': 1; (only required if table has sort key).
        },
        // Define expressions for the new or updated attributes
        UpdateExpression: "set cover = :c", // For example, "'set Title = :t, Subtitle = :s'"
        ExpressionAttributeValues: {
          ":c": extension[0],
        },
        ReturnValues: "ALL_NEW",
      };

      const data = await ddbDocClient.send(new UpdateCommand(params));

      return res.status(201).json(data);
    }
  }
  return res
    .status(500)
    .json({ "err api/api/projects/a_uuid/p_uuid/cover ": req.method });
}
