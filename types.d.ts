interface Project {
  pk: "PROJECT";
  sk: string;
  // artistSlug: string;
  projectName: string;
  uuid: string;
  slug: string;
  cover: string;
  status?: string;
  validated?: string;
  path_s3: string;
  allow_download: boolean;
}
interface Artist {
  pk: "ARTIST";
  sk: string;
  artistName: string;
  projects: string;
  slug: string;
  uuid: string;
}
interface Track {
  pk: `${"TRACK"}`;
  sk: string;
  slug: string;
  track_name: string;
  track_url: string;
  track_id: number;

  uuid: string;
}

interface ProjectsWithArtistsData {
  project: Project;
  artist: Artist;
}
