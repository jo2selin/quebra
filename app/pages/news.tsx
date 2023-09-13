import React from "react";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import Link from "next/link";
import Img from "next/image";
let blogPosts = require("../data/hc2Posts.json");
import groq from "groq";
import client from "../client";

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

function PostList({ posts }: any) {
  return (
    <>
      {posts.map((post: PostQuebra) => (
        <Link
          key={post._id}
          href={`/post/fr/${post.slug.current}`}
          className=" text-white hover:text-jam-pink"
        >
          <article className="mb-4 flex items-center justify-center">
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
              <p className="font-mono text-xs  normal-case ">{post.excerpt}</p>
            </div>
          </article>
        </Link>
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
    _createdAt,
    mainImage {
      asset->{
        url,
        metadata
      }
    },
  }`;
  const postsQuebra = await client.fetch(query);
  console.log("postsQuebra-----", postsQuebra);

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
  return { props: { oldPostsHc, postsQuebra } };
}

function News({ oldPostsHc, postsQuebra }: any) {
  return (
    <>
      <PostList posts={postsQuebra} />
      <OldNewsHc oldPostsHc={oldPostsHc} />
    </>
  );
}

export default News;
