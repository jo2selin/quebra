import { server } from "../config";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./ddbDocClient";
// export async function getMe() {
//   const res = await fetch(`${server}/api/users/me`);
//   console.log("get me ", res);

//   const data = await res.json();

//   return data;
// }
export async function getArtists() {
  const res = await fetch(`${server}/api/users/`);
  const data = await res.json();

  return data;
}

export async function getDynamoArtists() {
  const paramsAllArtists = {
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
  const data = await ddbDocClient.send(new QueryCommand(paramsAllArtists));
  console.log("getDynamoArtists", data.Items);
  // const artists = data.Items ? data.Items : []: Artist;

  return data.Items;
}

// export async function getArtistBySlug(artistSlug: string) {
//   console.log("API getArtistBySlug", artistSlug);

//   const allArtists = await getArtists();
//   const dataArtist = allArtists.filter(
//     (artist: Artist) => artist.slug === artistSlug
//   );

//   console.log("API getArtistBySlug RETURN ", dataArtist[0]);
//   return dataArtist[0];
// }

export async function getProjects() {
  const res = await fetch(`${server}/api/projects/`);
  const data = await res.json();

  return data;
}
export async function getDynamoProjects() {
  const paramsAllProjects = {
    TableName: process.env.TABLE,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": "PROJECT",
    },
  };
  const data = await ddbDocClient.send(new QueryCommand(paramsAllProjects));
  const publishedProjects = data.Items?.filter((p) => p.status === "PUBLISHED");
  return publishedProjects;
}
export async function getMyProjects(a_uuid: string) {
  const res = await fetch(`${server}/api/projects/${a_uuid}?s=slugs`);
  const data = await res.json();
  return data;
}
export async function getTracksFromProject(a_uuid: string, p_uuid: string) {
  const res = await fetch(`${server}/api/projects/${a_uuid}/${p_uuid}/tracks`);
  const data = await res.json();

  return data;
}
export async function getDynamoTracksFromProject(
  a_uuid: string,
  p_uuid: string
) {
  const paramsAllTracksFromProject = {
    TableName: process.env.TABLE,
    KeyConditionExpression: "pk = :pk and begins_with(sk, :p_uuid)",
    ExpressionAttributeValues: {
      ":pk": "TRACK",
      ":p_uuid": p_uuid,
    },
  };
  const data = await ddbDocClient.send(
    new QueryCommand(paramsAllTracksFromProject)
  );

  return data.Items;
}

// export async function getArtistFromProject(projectSK: string) {
//   const a_uuid = projectSK.split("#")[0];
//   const allArtists = await getArtists();
//   const dataArtist = allArtists.filter(
//     (artist: Artist) => artist.uuid === a_uuid
//   );
//   return dataArtist[0];
// }

export async function checkProjectSlugAvailable(slug: string, a_uuid: string) {
  const slugFound = getMyProjects(a_uuid).then((projects: Array<Project>) => {
    console.log("projects checkProjectSlugAvailable", projects);

    const res = projects.filter((p: Project) => p.slug === slug);
    return res[0] ? true : false;
  });
  console.log("checkProjectSlugAvailable, slugFound:", await slugFound);

  const slugNotAvailable = await slugFound;

  return !slugNotAvailable;
}

export async function checkArtistSlugAvailable(slug: string) {
  const slugFound = getArtists().then((artists: Artist[]) => {
    console.log("checkArtistSlugAvailable", artists);

    const res = artists.filter((a: Artist) => a.slug === slug);
    return res[0] ? true : false;
  });
  console.log("checkArtistSlugAvailable, slugFound:", await slugFound);

  const slugNotAvailable = await slugFound;

  return !slugNotAvailable;
}

// export async function getProjectBySlug(slug: string) {
//   // Call an external API endpoint to get users
//   const res = await fetch(`${server}/api/projects/${slug}`);
//   const data = await res.json();

//   return data;
// }
