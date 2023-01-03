import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { twBigButton, twCenteringBlock } from "../utils/twCommon";
import { FunLoader } from "../components/Loader";
import { LoggedIn } from "../components/LoggedIn";

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
            <FunLoader />
          </div>
        ) : null}

        {status === "unauthenticated" ? (
          <div className={`${twCenteringBlock}`}>
            <button className={`${twBigButton}`} onClick={() => signIn()}>
              sign in
            </button>
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
