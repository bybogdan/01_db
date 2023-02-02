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
          <div className="p-6">
            <div className="flex items-center justify-center gap-2">
              <Image priority={true} width={50} src={logo} alt="Logo" />
              <h5 className=" text-center text-xl leading-tight text-gray-900 dark:text-white">
                Dialga : Money tracker
              </h5>
            </div>
            <div className={twCenteringBlock}>
              <button className={`${twBigButton}`} onClick={() => signIn()}>
                sign in
              </button>
            </div>
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
