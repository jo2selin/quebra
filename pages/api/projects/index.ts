import { UpdateCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { v4 as uuidv4 } from "uuid";

import { ddbDocClient } from "../../../libs/ddbDocClient";
import { checkAvaibilityProjectSlug } from "../../../libs/api";

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

async function createSlug(input: string) {
  const isProjectSlugAvailable = await checkAvaibilityProjectSlug(input).then(
    (data) => {
      console.log("createSlug", data);
      return data;
    }
  );
  const slug = isProjectSlugAvailable ? input : generateUniqueSlug(input);

  return slug;
}

function generateUniqueSlug(slug: string) {
  const u = uuidv4().slice(0, 5);
  console.log("generateUniqueSlug", u + "-" + slug);
  return u + "-" + slug;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getUserArtist = async (email: string) => {
    const userArtist = await fetch(`${server}/api/users/${email}`, {
      method: "GET",
    });

    return userArtist.json();
  };

  // === GET ========================================
  if (req.method === "GET") {
    console.log("GET ALL PROJECTS");

    // get all PROJECTS
    const data = await ddbDocClient.send(new QueryCommand(paramsAllProjects));
    return res.status(200).json(data.Items);
  }

  // === POST ========================================
  if (req.method === "POST") {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      res.send({
        error: "You must be signed in to access this route.",
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

      const slug = await createSlug(slugProjectName);

      const userArtist: any = await getUserArtist(session.user?.email);

      const data = await ddbDocClient.send(
        new PutCommand({
          TableName: process.env.TABLE,
          Item: {
            pk: "PROJECT",
            sk: userArtist.uuid + "#" + uuid,
            projectName: projectName,
            email: session.user?.email,
            artistSlug: userArtist.slug,
            slug: slug,
            uuid: uuid,
          },
        })
      );

      return res.status(201).json(data);
    }
  }
}
