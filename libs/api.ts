import { server } from "../config";

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

// export async function getProjectBySlug(slug: string) {
//   // Call an external API endpoint to get users
//   const res = await fetch(`${server}/api/projects/${slug}`);
//   const data = await res.json();

//   return data;
// }
