interface Project {
  pk: "PROJECT";
  sk: string;
  artistSlug: string;
  projectName: string;
}
interface Artist {
  pk: "ARTIST";
  sk: string;
  artistName: string;
  projects: string;
  slug: string;
}
