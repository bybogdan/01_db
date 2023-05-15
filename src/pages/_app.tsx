import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const splashScreen = document.getElementById("splashScreen");
      if (splashScreen) splashScreen.style.display = "none";
    }
  }, []);

  return (
    <>
      <Head>
        <title>Diagla - money tracker</title>
        <meta
          name="description"
          content="Convenient way to control your finances"
        />
        <link rel="icon" href="/favicon.ico" />

        <meta
          property="og:image"
          content="https://dialga-lake.vercel.app/icon-512x512.png"
        />
        <meta property="og:title" content="Diagla - money tracker" />
        <meta
          property="og:description"
          content="Convenient way to control your finances"
        />
        <meta property="og:url" content="https://dialga-lake.vercel.app/" />
        <meta content="website" property="og:type" />
        <meta content="Diagla - money tracker" property="og:image:alt" />
        <meta name="application-name" content="Diagla - money tracker" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="Diagla - money tracker"
        />
        <meta name="mobile-web-app-capable" content="yes" />

        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1E293B"
          media="(prefers-color-scheme: dark)"
        />
      </Head>
      <SessionProvider session={session}>
        <div className="w-full overflow-x-hidden">
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 1000 }}
          />
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
