import React from "react";
import { GetStaticProps } from "next";
import { server } from "../../../config";
import { getProjects } from "../../../libs/api";

// Creating static pages with slugs
export async function getStaticPaths() {
  const projects = await getProjects();

  const paths = projects.map((project: Project) => ({
    params: {
      projectSlug: project.projectName,
    },
  }));

  return {
    paths: paths,
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export const getStaticProps = async ({ params }: any) => {
  if (!params?.projectSlug) return false;

  const projects = await getProjects();

  const project = projects.filter(
    (p: Project) => p.projectName === params.projectSlug
  )[0];

  console.log("the project is ", project);

  return {
    props: { project: project },
  };
};

type propsType = { project: Project; artist: Artist };

export default function Project(props: propsType) {
  console.log("props PAGE ==", props);

  return <h1>{props.project.projectName}</h1>;
}
