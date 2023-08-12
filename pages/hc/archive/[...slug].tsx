import React from "react";
import { NextSeo } from "next-seo";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Image from "next/image";

import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";

interface ArchiveBlog {
  params: {
    frontmatter: {
      title: string;
      slug: string;
      date: string;
      image: string;
      category: Array<string>;
    };
    content: string;
  };
}

const hcArchiveFiles = fs.readdirSync(path.join("data/hc-old-news"));

export const getStaticPaths: GetStaticPaths = async () => {
  // Creating pages with slug from fonrtmatter
  // Get slug and frontmatter from posts
  const tempPosts = hcArchiveFiles.map((filename) => {
    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(
      path.join("data/hc-old-news", filename),
      "utf-8"
    );
    //convert data in json format
    const { data: frontmatter } = matter(markdownWithMeta);
    // passing slug as an array
    const splittedSlug = frontmatter.slug.split("/").slice(1);

    return { params: { slug: splittedSlug } };
  });

  return {
    paths: tempPosts,
    fallback: false, // false or "blocking"
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const fullSlug = params.slug.join("/");

  // Get slug from the slug params then match it with slug from .md and return post data
  const findPost = hcArchiveFiles.filter((filename) => {
    //   // Reading inside each file for the slug
    const markdownWithMeta = fs.readFileSync(
      path.join("data/hc-old-news", filename),
      "utf-8"
    );
    const { data: frontmatter } = matter(markdownWithMeta);
    return frontmatter.slug === "/" + fullSlug;
  });
  console.log("findPost[0]", findPost[0]);

  // Reading inside specific file for the frontmatter
  const markdownWithMeta = fs.readFileSync(
    path.join("data/hc-old-news", findPost[0]),
    "utf-8"
  );

  //convert data in json format
  const { data: frontmatter, content } = matter(markdownWithMeta);

  return { props: { params: { frontmatter, content } } };
};

function News({ params }: ArchiveBlog) {
  if (!params?.frontmatter.title) return <p>Loading</p>;
  return (
    <>
      <NextSeo
        title={
          params.frontmatter?.title +
          " " +
          process.env.NEXT_PUBLIC_QUEBRA_META_TITLE_SUFFIX
        }
        description={
          "Read about " + params.frontmatter?.title + ", on Quebra.co"
        }
        canonical={`https://quebra.co/hc/archive${params.frontmatter?.slug}`}
        openGraph={{
          url: `https://quebra.co/hc/archive${params.frontmatter?.slug}`,
          title:
            params.frontmatter?.title +
            " " +
            process.env.NEXT_PUBLIC_QUEBRA_META_TITLE_SUFFIX,
          description:
            "Read about " + params.frontmatter?.title + ", on Quebra.co",
          images: [
            {
              url: `https://hauteoldassets.blob.core.windows.net/assets/${params.frontmatter.image}`,
              width: 640,
              height: 291,
              alt: params.frontmatter?.title,
              type: "image/jpeg",
            },
          ],
          type: "article",
          article: {
            tags: [
              params.frontmatter.category ? params.frontmatter.category[0] : "",
            ],
          },
        }}
      />

      {params.frontmatter.image && (
        <Image
          src={`https://hauteoldassets.blob.core.windows.net/assets/${params.frontmatter.image}`}
          width={250}
          height={100}
          alt={params.frontmatter.title}
        />
      )}
      {params.frontmatter.title && (
        <h1 className="text-4xl pb-10">{params.frontmatter.title}</h1>
      )}
      {params.content && (
        <div
          className=" text-base font-serif  normal-case  mb-12"
          dangerouslySetInnerHTML={{ __html: params.content }}
        />
      )}
    </>
  );
}

export default News;
