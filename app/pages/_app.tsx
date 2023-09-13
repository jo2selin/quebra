import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "@fontsource/passion-one";
import Layout from "../components/layout";

if (process.env.NEXT_PUBLIC_API_MOCKING === "true") {
  import("../test").then(({ setupMocks }) => {
    console.log("setupMocks");

    setupMocks();
  });
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}