import { server } from "../config";

export async function loadArtists() {
  // Call an external API endpoint to get posts
  const res = await fetch(`${server}/api/users/`);
  const data = await res.json();

  return data;
}
