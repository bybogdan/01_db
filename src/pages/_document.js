import Document, { Html, Head, Main, NextScript } from "next/document";
import splashScreen from "../splashScreenStyles";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png"></link>
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
          <style>
            {splashScreen}
          </style>
        </Head>
        <body>
            <div id="splashScreen">
              <div className="logo"/>
            </div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
