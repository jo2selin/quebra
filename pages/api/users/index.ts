import { QueryCommand } from "@aws-sdk/client-dynamodb";
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import slugify from "slugify";

import { ddbClient } from "../../../libs/ddbClient.js";
import type { NextApiRequest, NextApiResponse } from "next";

export const paramsAllArtists = {
  TableName: process.env.TABLE,
  KeyConditionExpression: "pk = :pk",
  ExpressionAttributeValues: {
    ":pk": { S: "ARTIST" },
  },
  ProjectionExpression: "artistName, slug",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    console.log("getting all artists profiles infos ");
    const data = await ddbClient.send(new QueryCommand(paramsAllArtists));
    return res.status(200).json(data.Items);
  }
}
