import Document, { Html, Head, Main, NextScript } from "next/document";
import splashScreen from "../splashScreenStyles";
import Image from "next/image";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
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
          {/* apple-touch-startup-image NOW WORKING */}
          <link
            href="splashscreens/iphone5_splash.png"
            media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/iphone6_splash.png"
            media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/iphoneplus_splash.png"
            media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/iphonex_splash.png"
            media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/iphonexr_splash.png"
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/iphonexsmax_splash.png"
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/ipad_splash.png"
            media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/ipadpro1_splash.png"
            media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/ipadpro3_splash.png"
            media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href="splashscreens/ipadpro2_splash.png"
            media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <meta name="apple-mobile-web-app-capable" content="yes"></meta>
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
            <div className="logo light">
              <Image
                alt="icon"
                src="/icon-192x192.png"
                width={192}
                height={192}
                priority={true}
              />
            </div>
            <div className="logo dark">
              <Image
                alt="icon"
                src="/icon-192x192-dark.png"
                width={192}
                height={192}
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
