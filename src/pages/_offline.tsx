import Head from "next/head";
import splashScreen from "../splashScreenStyles";
import Image from "next/image";

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
          <div className="logo">
            <Image
              alt="icon"
              src="/icon-192x192.png"
              width={192}
              height={192}
              priority={true}
              placeholder="blur"
              blurDataURL="/icon-192x192.svg"
            />
          </div>
        </div>
      </body>
    </>
  );
};

export default OfflinePage;
