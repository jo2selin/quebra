import { QueryCommand } from "@aws-sdk/lib-dynamodb";

import { ddbDocClient } from "../../../libs/ddbDocClient";

import type { NextApiRequest, NextApiResponse } from "next";

export const paramsAllArtists = {
  TableName: process.env.TABLE,
  KeyConditionExpression: "pk = :pk",
  ExpressionAttributeValues: {
    ":pk": "ARTIST",
  },
  ExpressionAttributeNames: {
    "#a_uuid": "uuid",
  },
  ProjectionExpression: "artistName, slug, #a_uuid",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const data = await ddbDocClient.send(new QueryCommand(paramsAllArtists));
    return res.status(200).json(data.Items);
  }
}
