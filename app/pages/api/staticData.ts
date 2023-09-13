import path from "path";

import { promises as fs } from "fs";

export default async function handler(req: any, res: any) {
  //Find the absolute path of the json directory

  // const jsonDirectory = path.join(process.cwd(), "json");

  //Read the json data file data.json

  const artistsData = await fs.readFile("data/BSONartist.json", "utf8");
  const postsData = await fs.readFile("data/BSONpost.json", "utf8");

  //Return the content of the data file in json format
  const jsonArtist = JSON.parse(artistsData);
  const jsonPost = JSON.parse(postsData);

  res.status(200).json({ jsonArtist: jsonArtist, postsData: jsonPost });
}
