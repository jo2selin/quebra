import React from "react";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import Link from "next/link";
import Img from "next/image";
let blogPosts = require("../data/hc2Posts.json");
import groq from "groq";
import client from "../client";
import date from "date-and-time";
import fr from "date-and-time/locale/fr";

function OldNewsHc({ oldPostsHc }: { oldPostsHc: HcPost[] }) {
  return (
    <>
      {oldPostsHc.map((postHc: HcPost) => {
        return (
          <Link
            key={postHc.id}
            href={`hc/posts/${postHc.hcType}/${postHc.hcDate}/${postHc.hcSlug}`}
            className=" text-white hover:text-jam-pink"
          >
            <article className="mb-4 flex items-center">
              <aside className="text-3xl">{postHc.emoji}</aside>{" "}
              <h2 className="pl-4 text-xl ">{postHc.title}</h2>
            </article>
          </Link>
        );
      })}
    </>
  );
}

function MainPost({ post }: { post: PostQuebra }) {
  return (
    <Link
      href={`/post/fr/${post.slug.current}`}
      className=" text-white hover:text-jam-pink"
    >
      <article className="relative mb-12  md:mb-20">
        <Img
          src={post.mainImage.asset.url + "?h=300&w=640&fit=crop"}
          width={640}
          height={300}
          alt={post.title}
          placeholder="blur"
          blurDataURL={post.mainImage.asset.metadata.lqip}
        />
        <div className="absolute top-4 right-8 flex items-end justify-end">
          <span className="mt-3 ml-3  inline-block px-1 font-mono text-xs normal-case ">
            {post.emoji}
          </span>
          <span className="mt-3 ml-3  inline-block bg-jam-dark-grey px-1 font-mono text-xs normal-case ">
            {date.format(new Date(post._createdAt), "dddd, DD MMM YYYY")}
          </span>
          <span className="mt-3  inline-block bg-jam-purple px-1 font-mono text-xs normal-case ">
            {post.country === "fr" ? "France" : "Etats Unis"}
          </span>
        </div>
        <div className="pt-4 ">
          <h2 className=" text-2xl">{post.title}</h2>
          <p className="font-mono text-xs  normal-case ">{post.excerpt}</p>
        </div>
      </article>
    </Link>
  );
}

function PostList({ posts }: any) {
  return (
    <>
      {posts.map((post: PostQuebra) => (
        <React.Fragment key={post._id}>
          <Link
            href={`/post/fr/${post.slug.current}`}
            className=" text-white hover:text-jam-pink"
          >
            <article className="mb-6 flex items-center justify-center">
              <div className="max-w-md">
                <Img
                  src={post.mainImage.asset.url + "?h=150&w=230&fit=crop"}
                  width={230}
                  height={150}
                  alt={post.title}
                  placeholder="blur"
                  blurDataURL={post.mainImage.asset.metadata.lqip}
                />
              </div>
              <div className="flex:1 pl-4 ">
                <h2 className=" text-xl">{post.title}</h2>
                <p className="font-mono text-xs  normal-case ">
                  {post.excerpt}
                </p>
                <div className="flex items-end justify-end">
                  <span className="mt-3 ml-3 hidden bg-jam-dark-grey px-1 font-mono text-xs normal-case md:inline-block ">
                    {post.emoji}
                  </span>
                  <span className="mt-3 ml-3 hidden bg-jam-dark-grey px-1 font-mono text-xs normal-case md:inline-block ">
                    {date.format(
                      new Date(post._createdAt),
                      "dddd, DD MMM YYYY",
                    )}
                  </span>
                  <span className="mt-3 hidden bg-jam-purple px-1 font-mono text-xs normal-case md:inline-block ">
                    {post.country === "fr" ? "France" : "Etats Unis"}
                  </span>
                </div>
              </div>
            </article>
          </Link>
        </React.Fragment>
      ))}
    </>
  );
}

export async function getStaticProps() {
  const query = groq`*[_type == "post"]{
    title,
    source,
    "excerpt": array::join(string::split((pt::text(body)), "")[0..100], "") + "..." ,
    language,
    slug,
    country,
    emoji,
    _createdAt,
    _id,
    mainImage {
      asset->{
        url,
        metadata
      }
    },
  }| order(_createdAt desc)`;
  const postsQuebra = await client.fetch(query);

  let requiredData: Array<HcPost> = [];
  blogPosts
    .sort((a: HcPost, b: HcPost) => (a.hcDate < b.hcDate ? -1 : 1))
    .map((d: any) => {
      requiredData = [
        ...requiredData,
        {
          id: d.id,
          emoji: d.emoji ? d.emoji : "",
          title: d.title,
          hcType: d.hcType,
          hcDate: d.hcDate,
          hcSlug: d.hcSlug,
        },
      ];
    });

  const oldPostsHc = requiredData.reverse();
  return { props: { oldPostsHc, postsQuebra }, revalidate: 10 };
}

function News({ oldPostsHc, postsQuebra }: any) {
  return (
    <div className=" md:mx-auto md:max-w-3xl">
      <h1 className="mb-4 text-3xl">News</h1>
      <MainPost post={postsQuebra[0]} />
      <PostList posts={postsQuebra.slice(1)} />
      <OldNewsHc oldPostsHc={oldPostsHc} />
    </div>
  );
}

export default News;
