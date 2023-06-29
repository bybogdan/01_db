import Image from "next/image";
import { LinkToHome } from "../../components/linkToHome";

export default function Install() {
  return (
    <div className="mx-auto flex flex-col items-center justify-start py-6 px-6 md:w-6/12">
      <section className="mx-auto">
        <h1 className="font-heading leading-tighter flex flex-col justify-between text-4xl font-bold tracking-tighter md:text-5xl ">
          <a
            target="_blank"
            href="https://dialga-lake.vercel.app/"
            rel="noreferrer"
          >
            <span className="flex gap-4">
              Dialga: Money tracker{" "}
              <Image
                className="animate-reverse-spin"
                alt="icon"
                src="/icon-512x512-transparent.png"
                width={80}
                height={60}
                priority={true}
              />
            </span>
          </a>
          <span>Installation Steps</span>{" "}
        </h1>

        <div className="mx-auto mt-10 flex flex-col gap-10">
          <span>
            Dialga : Money tracker is a web application, but it can be installed
            on your device from browsers. The way to install th app is different
            from browsers:
          </span>
          <div>
            <h2 className="font-heading leading-tighter mb-2 text-2xl font-bold tracking-tighter md:text-3xl">
              Chrome on Android
            </h2>
            <ol>
              <li>
                Go to:{" "}
                <a
                  className="text-blue-500"
                  href="https://dialga-lake.vercel.app/"
                >
                  https://dialga-lake.vercel.app/
                </a>{" "}
                on Chrome
              </li>
              <li>
                Tap <strong>Install</strong> or{" "}
                <strong>Add to Home Screen</strong> (if not shown, please tap
                the more icon on Chrome and tap{" "}
                <strong>Add to Home Screen</strong>)
              </li>
            </ol>
            <p>
              reference:{" "}
              <a
                className="text-blue-500"
                target="_blank"
                href="https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&amp;oco=1"
                rel="noreferrer"
              >
                source link
              </a>
            </p>
          </div>

          <div>
            <h2 className="font-heading leading-tighter mb-2 text-2xl font-bold tracking-tighter md:text-3xl">
              Safari on iOS
            </h2>
            <ol>
              <li>
                Go to:{" "}
                <a
                  className="text-blue-500"
                  href="https://dialga-lake.vercel.app/"
                >
                  https://dialga-lake.vercel.app/
                </a>{" "}
                on Safari
              </li>
              <li>Tap the share icon in the menu bar</li>
              <li>
                Scroll down the list of options, then tap{" "}
                <strong>Add to Home Screen</strong>
              </li>
            </ol>
            <p>
              reference:{" "}
              <a
                className="text-blue-500"
                target="_blank"
                href="https://support.apple.com/guide/iphone/bookmark-favorite-webpages-iph42ab2f3a7/ios"
                rel="noreferrer"
              >
                source link
              </a>
            </p>
          </div>

          <div>
            <h2 className="font-heading leading-tighter mb-2 text-2xl font-bold tracking-tighter md:text-3xl">
              Chrome on Windows, Mac, Linux
            </h2>
            <ol>
              <li>
                Go to:{" "}
                <a href="https://dialga-lake.vercel.app/">
                  https://dialga-lake.vercel.app/
                </a>{" "}
                on Chrome
              </li>
              <li>
                At the top right of the address bar, click the install icon
              </li>
            </ol>
            <p>
              reference:{" "}
              <a
                className="text-blue-500"
                target="_blank"
                href="https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DDesktop&amp;oco=1"
                rel="noreferrer"
              >
                source link
              </a>
            </p>
          </div>

          <div>
            <h2 className="font-heading leading-tighter mb-2 text-2xl font-bold tracking-tighter md:text-3xl">
              Edge on Windows
            </h2>
            <ol>
              <li>
                Go to:{" "}
                <a href="https://dialga-lake.vercel.app/">
                  https://dialga-lake.vercel.app/
                </a>{" "}
                on Edge
              </li>
              <li>
                At the top right of the address bar, click the app available
                icon
              </li>
            </ol>
            <p>
              reference:{" "}
              <a
                className="text-blue-500"
                target="_blank"
                href="https://learn.microsoft.com/microsoft-edge/progressive-web-apps-chromium/ux"
                rel="noreferrer"
              >
                source link
              </a>
            </p>
          </div>
        </div>
        <LinkToHome />
      </section>
    </div>
  );
}
