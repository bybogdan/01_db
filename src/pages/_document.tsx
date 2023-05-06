import Document, { Html, Head, Main, NextScript } from "next/document";
import splashScreen from "../splashScreenStyles";
import Image from "next/image";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="apple-touch-icon"
            href="touch-icons/apple-touch-icon-iphone-60x60.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="touch-icons/apple-touch-icon-ipad-76x76.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="touch-icons/apple-touch-icon-iphone-retina-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="touch-icons/apple-touch-icon-ipad-retina-152x152.png"
          />
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
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
