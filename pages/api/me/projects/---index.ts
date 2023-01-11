import {
  GetItemCommand,
  QueryCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

import { ddbClient } from "../../../../libs/ddbClient.js";
import type { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";

export const paramsAllProjects = {
  TableName: process.env.TABLE,
  KeyConditionExpression: "pk = :pk",
  ExpressionAttributeValues: {
    ":pk": { S: "PROJECT" },
  },
  ProjectionExpression: "projectName, slug, sk",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.send({
      error: "You must be signed in to access this route.",
    });
  }

  // === GET ========================================
  // if (session && session.user?.email && req.method === "GET") {
  //   // get all PROJECTS
  //   const data = await ddbClient.send(new QueryCommand(paramsAllProjects));
  //   return res.status(200).json(data.Items);
  //   postMessage;
  // }

  // === POST ========================================
  if (session && session.user?.email && req.method === "POST") {
    // post new user PROJECT
    const { projectName } = req.body;
    const slugProjectName = slugify(projectName, { lower: true, strict: true });

    const data = await ddbClient.send(
      new PutItemCommand({
        TableName: process.env.TABLE,
        Item: {
          pk: { S: "PROJECT" },
          sk: { S: slugProjectName },
          projectName: { S: projectName },
          email: { S: session.user?.email },
        },
      })
    );

    return res.status(201).json(data);
  }

  return res.status(500).json({ "err api/project ": req.method });
}
