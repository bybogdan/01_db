import Head from "next/head";
import splashScreen from "../splashScreenStyles";

const OfflinePage = () => {
  return (
    <>
      <Head>
        <title>Dialga</title>
        <meta name="description" content="Dialga" />
        <link rel="icon" href="/favicon.ico" />

        <meta
          property="og:image"
          content="https://dialga-lake.vercel.app/icon-512x512.png"
        />
        <meta property="og:title" content="Diagla" />
        <meta property="og:description" content="Money tracker" />
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
        <style>{splashScreen}</style>
      </Head>
      <body>
        <div id="splashScreen">
          <div className="logo" />
        </div>
      </body>
    </>
  );
};

export default OfflinePage;
