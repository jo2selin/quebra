import React from "react";
import { GetStaticProps } from "next";
import { server } from "../../../config";
import {
  getProjects,
  getProjectBySlug,
  getArtistBySlug,
} from "../../../libs/api";

// Creating static pages with slugs
export async function getStaticPaths() {
  const projects = await getProjects();

  const paths = projects.map((project: Project) => ({
    params: { projectSlug: project.sk },
  }));

  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log("getstatocProp params", params);
  if (!params?.projectSlug) return false;

  const project = await getProjectBySlug(params?.projectSlug as string);

  const artist = await getArtistBySlug(project.artistSlug);

  return {
    props: { project, artist },
  };
};

type propsType = { project: Project; artist: Artist };

export default function Project(props: propsType) {
  console.log("props PAGE ==", props);

  return <h1>{props.project.projectName}</h1>;
}
