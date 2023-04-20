import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { twBigButton, twCenteringBlock } from "../utils/twCommon";
import { Loader } from "../components/Loader";
import { LoggedIn } from "../components/LoggedIn";
import Image from "next/image";
import logo from "../../public/icon-192x192.png";

const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();

  return (
    <>
      <Head>
        <title>Dialga</title>
        <meta name="description" content="Dialga" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {status === "loading" ? (
          <div className={`${twCenteringBlock}`}>
            <Loader />
          </div>
        ) : null}

        {status === "unauthenticated" ? (
          <div className="flex h-screen flex-col items-center justify-between p-6">
            <div className="flex items-center justify-center gap-2">
              <Image
                className="rounded-xl"
                priority={true}
                width={50}
                src={logo}
                alt="Logo"
              />
              <h5 className=" font-boldtext-gray-900 max-w-2xl text-xl dark:text-white sm:text-3xl">
                Dialga : Money tracker
              </h5>
            </div>
            <button className={`${twBigButton}`} onClick={() => signIn()}>
              sign in
            </button>
            <div />
          </div>
        ) : null}

        {status === "authenticated" && sessionData?.user ? (
          <LoggedIn
            sessionUserName={sessionData.user.name as string}
            sessionUserId={sessionData.user.id}
          />
        ) : null}
      </div>
    </>
  );
};

export default Home;
