import {
  GetItemCommand,
  QueryCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import { ddbClient } from "../../../libs/ddbClient.js";
import type { NextApiRequest, NextApiResponse } from "next";
import { server } from "../../../config";

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

  const getProjectFromSlug = async (slugs: Array<string>) => {
    let userProjectsData: Array<Object> = [];

    async function queryProject(slug: string) {
      const projectData = await fetch(`${server}/api/projects/${slug}`, {
        method: "GET",
      });
      return projectData.json();
    }

    for (const slug of slugs) {
      userProjectsData = [...userProjectsData, await queryProject(slug)];
    }

    return userProjectsData;
  };

  // === GET ========================================
  if (session && session.user?.email && req.method === "GET") {
    const data = await ddbClient.send(
      new GetItemCommand({
        TableName: process.env.TABLE,
        Key: marshall({ pk: "ARTIST", sk: session.user?.email }),
      })
    );

    if (!data.Item) {
      // profile does not exist yet
      return res.status(200).json({});
    } else {
      const projects = await getProjectFromSlug(unmarshall(data.Item).projects);
      console.log("projects final res", projects);

      return res.status(200).json(projects);
    }
  }
}
