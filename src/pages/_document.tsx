import Document, { Html, Head, Main, NextScript } from "next/document";
import splashScreen from "../splashScreenStyles";
import Image from "next/image";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="apple-mobile-web-app-title" content="Dialga" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          {/* test */}
          {/* <!-- iPhone SPLASHSCREEN--> */}
          <link
            href="apple-touch-startup-image-320x460.png"
            media="(device-width: 320px)"
            rel="apple-touch-startup-image"
          />
          {/* <!-- iPhone (Retina) SPLASHSCREEN--> */}
          <link
            href="apple-touch-startup-image-640x920.png"
            media="(device-width: 320px) and (device-height: 460px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          {/* <!-- iPhone 5 (Retina) SPLASHSCREEN--> */}
          <link
            href="apple-touch-startup-image-640x1096.png"
            media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          {/* <!-- iPad (non-Retina) (Portrait) --> */}
          {/* <link
            href="apple-touch-startup-image-768x1004.png"
            media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)"
            rel="apple-touch-startup-image"
          /> */}
          {/* <!-- iPad (non-Retina) (Landscape) --> */}
          {/* <link
            href="apple-touch-startup-image-1024x748.png"
            media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape)"
            rel="apple-touch-startup-image"
          /> */}
          {/* <!-- iPad (Retina) (Portrait) --> */}
          {/* <link
            href="apple-touch-startup-image-1536x2008.png"
            media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait) and (-webkit-min-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          /> */}
          {/* test */}

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
          {/* <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            href="splash_screens/iPhone_14_Pro_Max_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            href="splash_screens/iPhone_14_Pro_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            href="splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            href="splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            href="splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            href="splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href="splash_screens/iPhone_11__iPhone_XR_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            href="splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href="splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href="splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href="splash_screens/12.9__iPad_Pro_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href="splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href="splash_screens/10.9__iPad_Air_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href="splash_screens/10.5__iPad_Air_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href="splash_screens/10.2__iPad_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href="splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href="splash_screens/8.3__iPad_Mini_landscape.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href="splash_screens/iPhone_14_Pro_Max_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href="splash_screens/iPhone_14_Pro_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href="splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href="splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href="splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href="splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="splash_screens/iPhone_11__iPhone_XR_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href="splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="splash_screens/12.9__iPad_Pro_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="splash_screens/10.9__iPad_Air_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="splash_screens/10.5__iPad_Air_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="splash_screens/10.2__iPad_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="splash_screens/8.3__iPad_Mini_portrait.png"
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
