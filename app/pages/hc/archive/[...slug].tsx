import React from "react";
import { NextSeo } from "next-seo";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Image from "next/image";
import groq from "groq";
import RelatedPost from "components/posts/relatedPosts";
import client from "client";

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
  morePosts: PostQuebra[];
}

const hcArchiveFiles = fs.readdirSync(path.join("data/hc-old-news"));

export const getStaticPaths: GetStaticPaths = async () => {
  // if (process.env.NEXTAUTH_URL === "http://localhost:3000") {
  //   // do not build blog on local
  //   return { paths: [], fallback: false };
  // }
  // Creating pages with slug from fonrtmatter
  // Get slug and frontmatter from posts
  const tempPosts = hcArchiveFiles.map((filename) => {
    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(
      path.join("data/hc-old-news", filename),
      "utf-8",
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

const queryMorePosts = groq`*[_type == "post"]{
  title,
  slug,
  _createdAt,
  _id,
  mainImage {
    asset->{
      url,
      metadata
    }
  }
} | order(_createdAt desc) [0..2]`;

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const fullSlug = params.slug.join("/");

  // Get slug from the slug params then match it with slug from .md and return post data
  const findPost = hcArchiveFiles.filter((filename) => {
    //   // Reading inside each file for the slug
    const markdownWithMeta = fs.readFileSync(
      path.join("data/hc-old-news", filename),
      "utf-8",
    );
    const { data: frontmatter } = matter(markdownWithMeta);
    return frontmatter.slug === "/" + fullSlug;
  });

  // Reading inside specific file for the frontmatter
  const markdownWithMeta = fs.readFileSync(
    path.join("data/hc-old-news", findPost[0]),
    "utf-8",
  );

  //convert data in json format
  const { data: frontmatter, content } = matter(markdownWithMeta);

  const morePosts = await client.fetch(queryMorePosts);

  return { props: { params: { frontmatter, content }, morePosts } };
};

function News({ params, morePosts }: ArchiveBlog) {
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
        canonical={`https://www.quebra.co/hc/archive${params.frontmatter?.slug}`}
        openGraph={{
          url: `https://www.quebra.co/hc/archive${params.frontmatter?.slug}`,
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
        <h1 className="pb-2 text-4xl">{params.frontmatter.title}</h1>
      )}
      <aside>
        <a
          href="https://www.amazon.fr/gp/dmusic/promotions/AmazonMusicUnlimited?tag=francemixtape-21"
          className="my-4 block rounded-md bg-jam-pink px-3 py-3"
        >
          <div className="text-2xl text-white">
            Offre Amazon music ! <br />
            jusqu'à 3 MOIS GRATUITS
          </div>
          <p className="font-mono text-sm normal-case text-white">
            Toutes les nouveautés, découvrez tous les derniers titres dès leur
            sortie
          </p>
        </a>
      </aside>
      {params.content && (
        <div
          className=" mb-1 font-serif  text-base  normal-case"
          dangerouslySetInnerHTML={{ __html: params.content }}
        />
      )}
      <p className=" mb-8 font-serif  text-base  normal-case">
        Ecoutez dès maintenant cet artiste sur Amazon Music, entre 1 et 3 mois
        gratuits.{" "}
        <a
          target="_blank"
          rel="noopener"
          href="https://www.amazon.fr/gp/dmusic/promotions/AmazonMusicUnlimited?tag=francemixtape-21"
        >
          Profitez de l'offre spéciale.
        </a>
        . Conditions sur amazon.fr
      </p>

      <aside>
        <p className="mb-5 font-mono text-xs normal-case text-jam-light-purple">
          Archive : Cet article a été publié sur HauteCulture
        </p>
        <div className="text-3xl">Articles Récents : </div>
      </aside>
      <RelatedPost posts={morePosts} />

      <aside>
        <a
          href="https://www.primevideo.com/?tag=francemixtape-21"
          className="my-4 block rounded-md bg-jam-pink px-3 py-3"
          target="_blank"
          rel="noopener"
        >
          <div className="text-2xl text-white">
            Prime Video ! <br />
            Essai gratuit de 30 jours
          </div>
          <p className="font-mono text-sm normal-case text-white">
            Diffusion en streaming illimitée de milliers de films et de séries
            télévisées
          </p>
        </a>
      </aside>
    </>
  );
}

export default News;
