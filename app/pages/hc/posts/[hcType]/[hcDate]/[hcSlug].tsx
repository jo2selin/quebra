import { remark } from "remark";
import html from "remark-html";
import { NextSeo } from "next-seo";

let blogPosts = require("../../../../../data/hc2Posts.json");
export async function getStaticPaths() {
  if (process.env.NEXTAUTH_URL === "http://localhost:3000") {
    // do not build blog on local
    return { paths: [], fallback: false };
  }
  const paths = blogPosts.map((post: any) => {
    return {
      params: {
        hcType: post.hcType as string,
        hcDate: post.hcDate as string,
        hcSlug: post.hcSlug as string,
      },
    };
  });

  return { paths: paths, fallback: false };
}

export async function getStaticProps({ params }: any) {
  let post = blogPosts.find((post: any) => post.hcSlug === `${params.hcSlug}`);

  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();
  post.contentHtml = contentHtml;

  // Pass post data to the page via props
  return { props: post, revalidate: 30 };
}

export default function Post(post: any) {
  return (
    <>
      <NextSeo
        title={
          (post.bait === "" || post.bait === undefined
            ? post.title
            : post.bait) +
          " " +
          process.env.NEXT_PUBLIC_QUEBRA_META_TITLE_SUFFIX
        }
        description={"Read about " + post.title + ", on Quebra.co"}
        canonical={`https://www.quebra.co/hc/posts/${post.hcType}/${post.hcDate}/${post.hcSlug}`}
        openGraph={{
          url: `https://www.quebra.co/hc/posts/${post.hcType}/${post.hcDate}/${post.hcSlug}`,
          title:
            (post.bait === "" ? post.title : post.bait) +
            " " +
            process.env.NEXT_PUBLIC_QUEBRA_META_TITLE_SUFFIX,
          description: "Read about " + post.title + ", on Quebra.co",
          type: "article",
        }}
      />

      {post.title && <h1 className="pb-10 text-4xl">{post.title}</h1>}
      <div className="flex">
        {post.emoji && <span className="mr-3 text-3xl">{post.emoji}</span>}
        {post.bait && <h2 className="text-lg">{post.bait}</h2>}
      </div>
      {post.contentHtml && (
        <div
          className=" mb-12 font-serif  text-base  normal-case"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      )}
      {post.media_source &&
        post.media_id &&
        post.media_source === "youtube" && (
          <div className="mb-12">
            <iframe
              className="w-full max-w-2xl"
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
