import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import { ddbClient } from "../../../libs/ddbClient.js";
import type { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";

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
  //   console.log("getting profile infos ", session.user?.email);

  //   const data = await ddbClient.send(
  //     new GetItemCommand({
  //       TableName: process.env.TABLE,
  //       Key: marshall({ pk: "ARTIST", sk: session.user?.email }),
  //     })
  //   );

  //   if (!data.Item) {
  //     // profile does not exist yet
  //     return res.status(200).json({});
  //   } else {
  //     return res.status(200).json(unmarshall(data.Item));
  //   }
  // }

  // === POST ========================================
  if (session && session.user?.email && req.method === "POST") {
    const { projectName } = req.body;
    const slugProjectName = slugify(projectName, { lower: true, strict: true });

    const data = await ddbClient.send(
      new PutItemCommand({
        TableName: process.env.TABLE,
        Item: {
          pk: { S: "PROJECT" },
          sk: { S: session.user?.email },
          projectName: { S: projectName },
          slug: { S: slugProjectName },
        },
      })
    );

    return res.status(201).json(data);
  }

  return res.status(500).json({ "err api/project ": req.method });
}
