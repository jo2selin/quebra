import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../libs/ddbDocClient";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";
import { server } from "../../../config";
import { getProjectBySlug } from "../../../libs/api";

export const paramsAllProjects = {
  TableName: process.env.TABLE,
  KeyConditionExpression: "pk = :pk",
  ExpressionAttributeValues: {
    ":pk": "PROJECT",
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

  const getProjectFromSlug = async (slugs: Array<string>) => {
    let userProjectsData: Array<Object> = [];

    for (const slug of slugs) {
      console.log(slug);

      userProjectsData = [...userProjectsData, await getProjectBySlug(slug)];
    }

    return userProjectsData;
  };

  // === GET ========================================
  if (session && session.user?.email && req.method === "GET") {
    const data = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.TABLE,
        Key: { pk: "ARTIST", sk: session.user?.email },
      })
    );

    console.log("data====", data.Item);

    if (!data.Item) {
      // profile does not exist yet
      return res.status(403).json({ info: "Your Artist is not set" });
    } else {
      const projects = await getProjectFromSlug(data.Item.projects || []);
      console.log("projects final res", projects);

      return res.status(200).json(projects);
    }
  }
}
