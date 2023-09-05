import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../libs/ddbDocClient";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.send({
      error: "You must be signed in to access this route: projects/me.",
    });
  }

  //  /projects/me

  // === GET ========================================
  // GET ALL MY PROJECTS
  if (session && session.user?.email && req.method === "GET") {
    const data = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.TABLE,
        Key: { pk: "ARTIST", sk: session.user?.email },
      })
    );

    if (!data.Item) {
      // profile does not exist yet
      return res.status(200).json([]);
    } else {
      const paramsAllMyProjects = {
        TableName: process.env.TABLE,
        KeyConditionExpression: "pk = :pk and begins_with(sk, :uuid)",
        ExpressionAttributeValues: {
          ":pk": "PROJECT",
          ":uuid": data.Item.uuid,
        },
      };

      const projects = await ddbDocClient.send(
        new QueryCommand(paramsAllMyProjects)
      );

      return res.status(200).json(projects.Items);
    }
  }
}
