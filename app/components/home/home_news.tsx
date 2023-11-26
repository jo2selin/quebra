import React from "react";
import SectionRounded from "../sectionRounded";
import Link from "next/link";
import Image from "next/image";

type propsType = {
  // projectsWithArtistsData: [{ project: Project; artist: Artist }];
  posts: PostQuebra[];
};

function Home_news({ posts }: propsType) {
  return (
    <SectionRounded>
      <ol>
        {posts.map((post: PostQuebra) => (
          <li key={post._id} className="transition-transform hover:scale-105">
            <Link
              href={`/post/fr/${post.slug.current}`}
              className=" text-white hover:text-jam-pink"
            >
              <article className="flex px-4 py-2 ">
                <Image
                  src={post.mainImage.asset.url + "?h=50&w=50&fit=crop"}
                  width={50}
                  height={50}
                  alt={post.title}
                  placeholder="blur"
                  blurDataURL={post.mainImage.asset.metadata.lqip}
                  className=" mr-5 h-[50px] w-[50px] rounded-full"
                />
                <h3 className="">{post.title}</h3>
              </article>
            </Link>
          </li>
        ))}
      </ol>
    </SectionRounded>
  );
}

export default Home_news;
