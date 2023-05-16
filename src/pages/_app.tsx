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
        {/* test pwa */}
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-640x1136.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        ></link>
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-750x1294.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        ></link>
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-1242x2148.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        ></link>
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-1125x2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        ></link>
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-1536x2048.png"
          media="(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
        ></link>
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-1668x2224.png"
          media="(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
        ></link>
        <link
          rel="apple-touch-startup-image"
          href="images/splash/launch-2048x2732.png"
          media="(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
        ></link>
        {/* test pwa */}
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
