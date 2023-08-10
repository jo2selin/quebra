import Head from "next/head";
import { remark } from "remark";
import html from "remark-html";

let blogPosts = require("../../../../data/hc2Posts.json");
export async function getStaticPaths() {
  console.log("getStaticPaths");

  // Call an external API endpoint to get posts
  // const res = await fetch("api/staticData");
  // const staticData = await res.json();

  // Get the paths we want to pre-render based on posts
  // const slug = slugify(post.title);
  // const logg = JSON.parse(blogPosts);
  // console.log(logg);

  const paths = blogPosts.map((post: any) => {
    // console.log(post.hcType, post.hcDate, post.hcSlug);

    return {
      params: {
        hcType: post.hcType as string,
        hcDate: post.hcDate as string,
        hcSlug: post.hcSlug as string,
      },
    };
  });

  // console.log("creating paths:", paths.params?.fullSlug);

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths: paths, fallback: false };
}

export async function getStaticProps({ params }: any) {
  console.log("getStaticProps========", params);

  // const { fullSlug } = params;
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  // const res = await fetch("api/staticData");
  // const post = await res.json()
  // console.log("params.fullSlug[1],", `${params.fullSlug[1]}}`);

  let post = blogPosts.find((post: any) => post.hcSlug === `${params.hcSlug}`);

  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();
  post.contentHtml = contentHtml;

  // Pass post data to the page via props
  return { props: post, revalidate: 30 };
}

export default function Post(post: any) {
  console.log(process.env.QUEBRA_META_TITLE_SUFFIX);

  return (
    <>
      <Head>
        <title key="title">
          {(post.bait === "" ? post.title : post.bait) +
            " " +
            process.env.NEXT_PUBLIC_QUEBRA_META_TITLE_SUFFIX}
        </title>
      </Head>
      {post.title && <h1 className="text-4xl pb-10">{post.title}</h1>}
      <div className="flex">
        {post.emoji && <span className="text-3xl mr-3">{post.emoji}</span>}
        {post.bait && <h2 className="text-lg">{post.bait}</h2>}
      </div>
      {post.contentHtml && (
        <div
          className=" text-base font-serif lowercase mb-12"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      )}
      {post.media_source &&
        post.media_id &&
        post.media_source === "youtube" && (
          <div className="mb-12">
            <iframe
              className="max-w-2xl w-full"
              height="315"
              src={`https://www.youtube-nocookie.com/embed/${post.media_id}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        )}
      {post.media_source &&
        post.media_id &&
        post.media_source === "instagram" && (
          <div className="mb-12">
            <blockquote
              className="instagram-media"
              data-instgrm-captioned
              data-instgrm-permalink={`https://www.instagram.com/${post.media_id}/?utm_source=ig_embed&amp;utm_campaign=loading`}
              data-instgrm-version="14"
            ></blockquote>{" "}
            <script async src="//www.instagram.com/embed.js"></script>
          </div>
        )}
      {post.media_source &&
        post.media_id &&
        (post.media_source === "twitter_tweet" ||
          post.media_source === "twitter_video") && (
          <div className="mb-12">
            <a
              href={`https://twitter.com/a/status/${post.media_id}`}
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              Tweet
            </a>
          </div>
        )}
    </>
  );
}
