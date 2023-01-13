import { UpdateCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import { ddbDocClient } from "../../../libs/ddbDocClient";

import type { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";
import { server } from "../../../config";

export const paramsAllProjects = {
  TableName: process.env.TABLE,
  KeyConditionExpression: "pk = :pk",
  ExpressionAttributeValues: {
    ":pk": "PROJECT",
  },
  ProjectionExpression: "pk, sk, projectName",
};

async function addProjectToUSER(email: string, slug: string) {
  console.log("addProjectToUSER", email, slug);

  const paramsOwnerOfProject = {
    TableName: process.env.TABLE,
    Key: {
      pk: "ARTIST",
      sk: email,
    },
    // ProjectionExpression: "#r",
    UpdateExpression: "set #attrName  = list_append(#attrName , :attrValue)",
    ExpressionAttributeNames: {
      "#attrName": "projects",
    },
    ExpressionAttributeValues: {
      ":attrValue": [slug],
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const data = await ddbDocClient.send(
      new UpdateCommand(paramsOwnerOfProject)
    );
    console.log("Success - item added or updated", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getUserArtist = async (email: string) => {
    const userArtist = await fetch(`${server}/api/users/${email}`, {
      method: "GET",
    });
    console.log("userArtist", userArtist);

    return userArtist.json();
  };

  // === GET ========================================
  if (req.method === "GET") {
    // get all PROJECTS
    const data = await ddbDocClient.send(new QueryCommand(paramsAllProjects));
    return res.status(200).json(data.Items);
    // postMessage;
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
      const slugProjectName = slugify(projectName, {
        lower: true,
        strict: true,
      });

      const userArtist: any = await getUserArtist(session.user?.email);
      console.log("userArtist=-==========", userArtist);

      const data = await ddbDocClient.send(
        new PutCommand({
          TableName: process.env.TABLE,
          Item: {
            pk: "PROJECT",
            sk: slugProjectName,
            projectName: projectName,
            email: session.user?.email,
            artistSlug: userArtist.slug,
          },
        })
      );

      await addProjectToUSER(session.user?.email, slugProjectName);

      return res.status(201).json(data);
    }
  }
}
