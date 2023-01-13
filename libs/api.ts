import { server } from "../config";

// export async function getMe() {
//   const res = await fetch(`${server}/api/users/me`);
//   console.log("get me ", res);

//   const data = await res.json();

//   return data;
// }
export async function getArtists() {
  // Call an external API endpoint to get users
  const res = await fetch(`${server}/api/users/`);
  const data = await res.json();

  return data;
}

export async function getArtistBySlug(artistSlug: string) {
  console.log("API getArtistBySlug", artistSlug);

  const allArtists = await getArtists();
  const dataArtist = allArtists.filter(
    (artist: Artist) => artist.slug === artistSlug
  );

  console.log("API getArtistBySlug RETURN ", dataArtist[0]);
  return dataArtist[0];
}

export async function getProjects() {
  // Call an external API endpoint to get users
  const res = await fetch(`${server}/api/projects/`);
  const data = await res.json();

  return data;
}

export async function getProjectBySlug(slug: string) {
  // Call an external API endpoint to get users
  const res = await fetch(`${server}/api/projects/${slug}`);
  const data = await res.json();

  return data;
}
