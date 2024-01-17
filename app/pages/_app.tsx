import "../styles/globals.css";
import type { AppProps } from "next/app";
import ErrorBoundary from "components/ErrorBoundary";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

import "@fontsource/passion-one";
import Layout from "../components/layout";

import "react-toastify/dist/ReactToastify.css";
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';

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
        <ErrorBoundary>
          <Component {...pageProps} />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            theme="dark"
            className={"text-sm normal-case"}
          />
        </ErrorBoundary>
      </Layout>
    </SessionProvider>
  );
}
