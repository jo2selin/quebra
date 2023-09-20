import React from "react";
import client from "client";
import groq from "groq";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Img from "next/image";
import date from "date-and-time";
import fr from "date-and-time/locale/fr";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import RelatedPost from "components/posts/relatedPosts";

const Post = ({ post, morePosts }: any) => {
  date.locale(fr);
  // if (post === undefined) {
  //   return <p>error 404</p>;
  // }
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const datePost = date.format(new Date(post._createdAt), "dddd, DD MMM YYYY");
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="mb-5 ">{children}</p>,
      blockquote: ({ children }) => (
        <blockquote className="mx-5 mb-5 border-l-4  border-l-purple-500 px-5 text-xl italic">
          {children}
        </blockquote>
      ),
    },
  };
  return (
    <>
      <NextSeo
        title={post.title + process.env.NEXT_PUBLIC_QUEBRA_META_TITLE_SUFFIX}
        description={"Read about " + post.title + ", on Quebra.co"}
        canonical={`https://www.quebra.co/post/${post.language}/${post.slug.current}`}
        openGraph={{
          url: `https://www.quebra.co/${post.language}/${post.slug.current}`,
          locale: post.language,
          title:
            post.title + " " + process.env.NEXT_PUBLIC_QUEBRA_META_TITLE_SUFFIX,
          description: "Read about " + post.title + ", on Quebra.co",
          type: "article",
          article: {
            publishedTime: post.publishedAt,
            authors: ["https://www.quebra.co"],
          },
          images: [
            {
              url: post.mainImage.asset.url,
              width: post.mainImage.asset.metadata.dimensions.width,
              height: post.mainImage.asset.metadata.dimensions.height,
              alt: post.title,
            },
          ],
        }}
      />
      <article>
        <h1 className="mb-5 text-3xl">{post.title}</h1>
        {post.mainImage && (
          <Img
            src={post.mainImage.asset.url + "?h=350&w=700"}
            width={700}
            height={350}
            alt={post.title}
            placeholder="blur"
            blurDataURL={post.mainImage.asset.metadata.lqip}
            className="mb-5"
          />
        )}
        <div className=" font-serif  text-base  normal-case">
          <PortableText
            value={post.body}
            // components={/* optional object of custom components to use */}
            components={components}
          />
        </div>
        <footer>
          Publié le <time dateTime={post._createdAt}>{datePost}</time>
          <aside className="flex justify-between">
            {post.source && (
              <a href={post.source} target="_blank">
                Source
              </a>
            )}
            <span>
              <a
                href={`mailto:contact@quebra.co?subject=Erreur%20news&body=Erreur%20dans%20l%20article%20:%20${post.slug.current}`}
              >
                {" "}
                Signaler une erreur
              </a>
            </span>
          </aside>
        </footer>
      </article>

      <RelatedPost posts={morePosts} />
    </>
  );
};

const queryPost = ` title,
source,
body,
language,
slug,
_createdAt,
_id,
mainImage {
  asset->{
    url,
    metadata
  }
},`;
const query = groq`*[_type == "post" && slug.current == $slug][0]{
  ${queryPost}
}`;
const queryMorePosts = groq`*[_type == "post" && slug.current != $slug]{
 ${queryPost}
} | order(_createdAt desc) [0..2]`;

export async function getStaticPaths() {
  const paths = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`,
  );

  return {
    paths: paths.map((slug: string) => ({ params: { lang: "fr", slug } })),
    fallback: true,
  };
}

export async function getStaticProps(context: any) {
  // It's important to default the slug so that it doesn't return "undefined"

  const { slug = "", lang } = context.params;
  const post = await client.fetch(query, { slug });
  const morePosts = await client.fetch(queryMorePosts, { slug });

  if (post === undefined || post === null || !post) {
    return {
      notFound: true,
      revalidate: 1,
    };
  }
  return {
    props: {
      post,
      morePosts,
    },
    revalidate: 10,
  };
}

export default Post;
