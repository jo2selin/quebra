import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../../libs/ddbDocClient";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { v4 as uuidv4 } from "uuid";

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
  if (session && session.user?.email && req.method === "GET") {
    const data = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.TABLE,
        Key: { pk: "ARTIST", sk: session.user?.email },
      })
    );

    if (!data.Item) {
      // profile does not exist yet
      return res.status(200).json({});
    } else {
      return res.status(200).json(data.Item);
    }
  }

  // === POST ========================================
  if (session && session.user?.email && req.method === "POST") {
    const { artistName } = req.body;
    const slugArtistName = slugify(artistName, { lower: true, strict: true });
    const uuid = uuidv4();

    // Define if we're saving or updating  if email allready exist:
    const artist = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.TABLE,
        Key: { pk: "ARTIST", sk: session.user?.email },
      })
    );
    if (!artist.Item) {
      // first save
      const data = await ddbDocClient.send(
        new PutCommand({
          TableName: process.env.TABLE,
          Item: {
            pk: "ARTIST",
            sk: session.user?.email,
            artistName: artistName,
            slug: slugArtistName,
            // projects: [],
            uuid: uuid,
          },
        })
      );
      return res.status(201).json(data);
    } else {
      // Updating Artist name/slug

      const params = {
        TableName: process.env.TABLE,
        Key: {
          pk: "ARTIST",
          sk: session.user?.email,
        },
        UpdateExpression: "set artistName = :a, slug = :s",
        ExpressionAttributeValues: {
          ":a": artistName,
          ":s": slugArtistName,
        },
        ReturnValues: "ALL_NEW",
      };

      const data = await ddbDocClient.send(new UpdateCommand(params));
      return res.status(201).json(data);
    }
  }

  return res.status(500).json({ "err api/users/me ": req.method });
}
