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
          {/* apple-touch-startup-image TEST */}
          {/* <link
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
          ></link> */}
          {/* apple-touch-startup-image */}
          {/* <link
            href="splashscreens/iphone5_splash.png"
            media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/iphone6_splash.png"
            media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/iphoneplus_splash.png"
            media="screen and (device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/iphonex_splash.png"
            media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/iphonexr_splash.png"
            media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/iphonexsmax_splash.png"
            media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/ipad_splash.png"
            media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/ipadpro1_splash.png"
            media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/ipadpro3_splash.png"
            media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/ipadpro2_splash.png"
            media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          /> */}
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
