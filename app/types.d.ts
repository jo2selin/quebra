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

interface PostQuebra {
  _id: string;
  _createdAt: string;
  title: string;
  slug: { current: string };
  mainImage: {
    asset: {
      url: string;
      metadata: { dimensions: { width: int; height: int }; lqip: string };
    };
  };
  publishedAt: date;
  body: object;
  source: string;
  language: string;
  excerpt?: string;
}

interface HcPost {
  id: string;
  emoji: string;
  title: string;
  hcType: string;
  hcDate: string;
  hcSlug: string;
}
