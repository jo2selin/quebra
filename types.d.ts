interface Project {
  pk: "PROJECT";
  sk: string;
  artistSlug: string;
  projectName: string;
  uuid: string;
  slug: string;
  cover: string;
  status?: string;
}
interface Artist {
  pk: "ARTIST";
  sk: string;
  artistName: string;
  projects: string;
  slug: string;
  uuid: string;
}
interface Tracks {
  pk: `${"TRACK#"}${string}`;
  sk: string;
  slug: string;
  track_name: string;
  track_url: string;
  track_id: string;

  uuid: string;
}
