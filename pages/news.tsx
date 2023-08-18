import React from "react";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import Link from "next/link";
let blogPosts = require("../data/hc2Posts.json");

type typePost = {
  id: string;
  emoji: string;
  title: string;
  hcType: string;
  hcDate: string;
  hcSlug: string;
};

export async function getStaticProps() {
  let requiredData: Array<typePost> = [];
  blogPosts
    .sort((a: typePost, b: typePost) => (a.hcDate < b.hcDate ? -1 : 1))
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

  const data = requiredData.reverse();
  return { props: { data } };
}

function News({ data }: any) {
  return data.map((post: any) => (
    <>
      <Link
        key={post.id}
        href={`hc/posts/${post.hcType}/${post.hcDate}/${post.hcSlug}`}
        className=" text-white hover:text-jam-pink"
      >
        <article className="flex items-center mb-4">
          <aside className="text-3xl">{post.emoji}</aside>{" "}
          <h2 className="text-xl pl-4 ">{post.title}</h2>
        </article>
      </Link>
    </>
  ));
}

export default News;
