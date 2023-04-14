import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";

import LoginBtn from "../components/login-btn";
import Button from "../components/button";
import triangles from "../public/triangles.svg";
import shareProject from "../public/share_project.svg";
import newTalents from "../public/new_talents.svg";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Quebra</title>
        <meta
          name="description"
          content="Quebra - Publish your musical project"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-sm mx-auto relative mb-24">
        <div className="relative z-10">
          <h1 className="text-3xl">
            Upload and Share <br />
            your music <br />
            with the world!
          </h1>
          <Button to={"/auth/signin"} className="mt-5">
            Get started
          </Button>
        </div>
        <Image
          priority
          src={triangles}
          alt=""
          className="absolute z-0 -right-3 top-0 max-w-xl"
          style={{ width: "100%" }}
        />
      </div>
      <p>
        WE provide a platform where Artists can upload and share their musical
        projects with others. Whether you’re a seasoned musician or just
        starting out, we believe that everyone should have the opportunity to
        showcase their work and connect with others who share their passion for
        music.
      </p>
      <div className="flex flex-col">
        <Image priority src={shareProject} alt="" className="self-end " />
        <Image priority src={newTalents} alt="" />
      </div>
      <h2 className="text-2xl">Latest releases</h2>
    </>
  );
}
