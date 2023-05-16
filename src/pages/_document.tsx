import Document, { Html, Head, Main, NextScript } from "next/document";
import splashScreen from "../splashScreenStyles";
import Image from "next/image";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="mobile-web-app-capable" content="yes" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="apple-touch-fullscreen" content="yes" />
          <meta
            name="apple-mobile-web-app-title"
            content="Diagla - money tracker"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          {/* apple-touch-icon */}
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
                src="/icon-192x192-transparent.png"
                width={75}
                height={75}
                priority={true}
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
