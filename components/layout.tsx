import Head from "next/head";
import Link from "next/link";
import Header from "./header";
import Footer from "./footer";
import Script from "next/script";
import { DefaultSeo } from "next-seo";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
          key="viewport"
        />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <link
          rel="apple-touch-icon"
          key="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          key="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          key="16x16"
          href="/favicon-16x16.png"
        />
      </Head>

      <DefaultSeo
        title={"Quebra.co"}
        description={"Quebra - Share your musical projects"}
        openGraph={{
          type: "website",
          locale: "fr_FR",
          url: "https://www.quebra.co/",
          siteName: "Quebra.co",
        }}
        twitter={{
          handle: "@quebra_co",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />
      {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-0TB54F3BGL"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-0TB54F3BGL');
        `}
      </Script>
      <Script id="brevo-chat" strategy="afterInteractive">
        {`(function(d, w, c) {
        w.BrevoConversationsID = '5e1356d9a4718d551e137ba9';
        w[c] = w[c] || function() {
            (w[c].q = w[c].q || []).push(arguments);
        };
        var s = d.createElement('script');
        s.async = true;
        s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
        if (d.head) d.head.appendChild(s);
    })(document, window, 'BrevoConversations');`}
      </Script>
      <div className=" bg-jam-dark-purple">
        <Header />

        <main className="container mx-auto mt-12 max-w-2xl px-4">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
