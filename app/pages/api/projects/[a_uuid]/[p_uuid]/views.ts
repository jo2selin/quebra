import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

import { ddbDocClient } from "../../../../../libs/ddbDocClient";

import type { NextApiRequest, NextApiResponse } from "next";
import { server } from "../../../../../config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //                  api/projects/a_uuid/p_uuid/views
  // === POST ========================================
  if (req.method === "POST") {
    // start by getting the view number

    const project = await ddbDocClient.send(
      // new QueryCommand(paramsProjectFromUuid)
      new GetCommand({
        TableName: process.env.TABLE,
        Key: { pk: "PROJECT", sk: req.query.a_uuid + "#" + req.query.p_uuid },
      }),
    );

    if (!project.Item) {
      return res.status(400).json({ error: "no data found" });
    }

    const params = {
      TableName: process.env.TABLE,
      Key: {
        pk: "PROJECT",
        sk: req.query.a_uuid + "#" + req.query.p_uuid, // For example,  'Episode': 1; (only required if table has sort key).
      },
      ExpressionAttributeNames: {
        "#views": "views",
      },
      UpdateExpression: "set  #views = :v", // For example, "'set Title = :t, Subtitle = :s'"
      ExpressionAttributeValues: {
        ":v": project.Item.views + 1,
      },
      ReturnValues: "ALL_NEW" as const,
    };

    const data = await ddbDocClient.send(new UpdateCommand(params));

    return res.status(200).json(data);
  }
  return res
    .status(500)
    .json({ "err api/api/projects/a_uuid/p_uuid/views ": req.method });
}
