import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { v4 as uuidv4 } from "uuid";

import { ddbDocClient } from "../../../libs/ddbDocClient";
import React from "react";
import { checkProjectSlugAvailable } from "../../../libs/api";

import type { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";
import { server } from "../../../config";

export const paramsAllProjects = {
  TableName: process.env.TABLE,
  KeyConditionExpression: "pk = :pk",
  ExpressionAttributeValues: {
    ":pk": "PROJECT",
  },
  // ExpressionAttributeNames: {
  //   "#p_uuid": "uuid",
  // },
  // ProjectionExpression: "pk, sk, projectName, #p_uuid",
};

async function createSlug(input: string, a_uuid: string) {
  const isProjectSlugAvailable = await checkProjectSlugAvailable(
    input,
    a_uuid
  ).then((data) => {
    return data;
  });

  const slug = isProjectSlugAvailable ? input : generateUniqueSlug(input);

  return slug;
}

function generateUniqueSlug(slug: string) {
  const u = uuidv4().slice(0, 5);
  return u + "-" + slug;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getUserArtist = async () => {};

  // === GET ========================================
  if (req.method === "GET") {
    // get all PROJECTS
    const data = await ddbDocClient.send(new QueryCommand(paramsAllProjects));
    const publishedProjects = data.Items?.filter(
      (p) => p.status === "PUBLISHED"
    );

    return res.status(200).json(publishedProjects);
  }

  // === POST ========================================
  if (req.method === "POST") {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      res.send({
        error: "You must be signed in to access this route POST api/Projects",
      });
    }
    if (session && session.user?.email && req.method === "POST") {
      // post new user PROJECT
      const { projectName } = req.body;
      const uuid = uuidv4();
      const slugProjectName = slugify(projectName, {
        lower: true,
        strict: true,
      });

      // const userArtist: Artist = await getUserArtist();

      const userArtist = await ddbDocClient.send(
        new GetCommand({
          TableName: process.env.TABLE,
          Key: { pk: "ARTIST", sk: session.user?.email },
        })
      );

      if (!userArtist.Item) {
        console.error("error post /project");
        return false;
      }
      const slug = await createSlug(slugProjectName, userArtist.Item.uuid);

      console.log("userArtist, /projects", userArtist);

      const data = await ddbDocClient.send(
        new PutCommand({
          TableName: process.env.TABLE,
          Item: {
            pk: "PROJECT",
            sk: userArtist.Item.uuid + "#" + uuid,
            projectName: projectName,
            // email: session.user?.email,
            // artistSlug: userArtist.slug,
            slug: slug,
            uuid: uuid,
            status: "DRAFT",
            validated: "",
            views: 0,
            path_s3: `${userArtist.Item.slug}-${slug}`,
            created_at: new Date().toISOString(),
          },
        })
      );

      return res.status(201).json(data);
    }
  }
}
