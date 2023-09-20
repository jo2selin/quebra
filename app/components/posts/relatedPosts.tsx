import React from "react";
import Link from "next/link";
import Img from "next/image";

function RelatedPosts({ posts }: { posts: PostQuebra[] }) {
  return (
    <aside className="mt-6 md:mt-20">
      <div className="flex flex-col md:flex-row">
        {posts.map((post: PostQuebra) => (
          <React.Fragment key={post._id}>
            <Link
              href={`/post/fr/${post.slug.current}`}
              className=" text-white hover:text-jam-pink"
            >
              <article className="relative mb-6 flex items-center justify-center md:first:mr-5">
                <div className=" w-full opacity-30">
                  <Img
                    src={post.mainImage.asset.url + "?h=250&w=500&fit=crop"}
                    width={500}
                    height={250}
                    alt={post.title}
                    placeholder="blur"
                    blurDataURL={post.mainImage.asset.metadata.lqip}
                  />
                </div>
                <div className="absolute max-h-40 w-full overflow-y-auto px-4 ">
                  <h2 className=" text-3xl md:text-2xl">{post.title}</h2>
                  <p className="font-mono text-xs  normal-case ">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
}

export default RelatedPosts;
