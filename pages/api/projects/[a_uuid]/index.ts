import {
  GetCommand,
  DeleteCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ddbDocClient } from "../../../../libs/ddbDocClient";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/projects/:artist_uuid
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // === GET ========================================

  const session = await unstable_getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    console.log("req.query", req.query);

    const paramsProjectByArtist = {
      TableName: process.env.TABLE,
      KeyConditionExpression: "pk = :pk and begins_with(sk, :a_uuid)",
      ExpressionAttributeValues: {
        ":pk": "PROJECT",
        ":a_uuid": req.query.a_uuid,
      },
    };

    const projects = await ddbDocClient.send(
      new QueryCommand(paramsProjectByArtist)
    );

    if (!projects.Items) {
      return res.status(400).json({ error: "no project found" });
    } else {
      // return all published project when not logged in
      let data = projects.Items?.filter((p) => p.status === "PUBLISHED");
      switch (req.query.s) {
        case "slugs":
          data = projects.Items?.filter(
            (p) => p.status === "PUBLISHED" || p.status === "DRAFT"
          );
          break;
        default:
          break;
      }
      console.log("req.query.s", req.query.s);

      // todo remove ? (not used yet): NOT WORKING : headers login via functions?
      if (session && session.user?.email === projects.Items[0].email) {
        switch (req.query.s) {
          case "published":
            data = projects.Items?.filter((p) => p.status === "PUBLISHED");
            break;
          case "draft":
            data = projects.Items?.filter((p) => p.status === "DRAFT");
            break;
          // case "deleted":
          //   data = projects.Items?.filter((p) => p.status === "DELETED");
          //   break;
          case "all":
            data = projects.Items;
            break;

          default:
            break;
        }
      }

      return res.status(200).json(data);
    }
  }
}
