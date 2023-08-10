import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";

const hcArchiveFiles = fs.readdirSync(path.join("data/hc-old-test"));

export const getStaticPaths: GetStaticPaths = async () => {
  // Creating pages with slug from fonrtmatter
  // Get slug and frontmatter from posts
  const tempPosts = hcArchiveFiles.map((filename) => {
    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(
      path.join("data/hc-old-test", filename),
      "utf-8"
    );
    //convert data in json format
    const { data: frontmatter } = matter(markdownWithMeta);
    const slug = frontmatter.slug;

    return { params: { slug } };
  });

  return {
    paths: tempPosts,
    fallback: true, // false or "blocking"
  };
};

export const getStaticProps = async ({ params }) => {
  // Get slug from the slug params then match it with slug from .md and return post data
  const findPost = hcArchiveFiles.filter((filename) => {
    // Reading inside each file for the slug
    const markdownWithMeta = fs.readFileSync(
      path.join("data/hc-old-test", filename),
      "utf-8"
    );
    const { data: frontmatter } = matter(markdownWithMeta);
    return frontmatter.slug === "/" + params.slug;
  });

  // Reading inside specific file for the content
  const markdownWithMeta = fs.readFileSync(
    path.join("data/hc-old-test", findPost[0]),
    "utf-8"
  );

  //convert data in json format
  const { data: frontmatter } = matter(markdownWithMeta);

  return { props: { params: frontmatter } };
};

function News({ params }) {
  console.log(params);

  return <div>NEWS -{params.title}</div>;
}

export default News;
