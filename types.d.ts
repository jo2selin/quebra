interface Project {
  pk: string;
  sk: string | Object<{}>;
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
