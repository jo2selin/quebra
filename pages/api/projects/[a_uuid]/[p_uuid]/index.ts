import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../../../libs/ddbDocClient";

import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/projects/:uuid
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // === GET ========================================
  if (req.method === "GET") {
    console.log("req.query", req.query);

    // const paramsProjectFromUuid = {
    //   TableName: process.env.TABLE,
    //   KeyConditionExpression: "pk = :pk and begins_with(sk, :uuid)",
    //   ExpressionAttributeValues: {
    //     ":pk": "PROJECT",
    //     ":uuid": req.query.uuid, // uuid is uuidA+uuuidP
    //   },
    // };
    // const data = await ddbDocClient.send(
    //   new GetCommand({
    //     TableName: process.env.TABLE,
    //     Key: { pk: "PROJECT", sk: req.query.slug },
    //   })
    // );
    const project = await ddbDocClient.send(
      // new QueryCommand(paramsProjectFromUuid)
      new GetCommand({
        TableName: process.env.TABLE,
        Key: { pk: "PROJECT", sk: req.query.a_uuid + "#" + req.query.p_uuid },
      })
    );

    if (!project.Item) {
      // profile does not exist yet
      return res.status(400).json({ error: "no data found" });
    } else {
      return res.status(200).json(project.Item);
    }
  }
}
