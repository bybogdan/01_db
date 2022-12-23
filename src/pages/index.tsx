import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

import { useEffect } from "react";
import Image from "next/image";

import { Header } from "../components/Header";
import { RecordForm } from "../components/RecordForm";
import { RecordsList } from "../components/RecordsList";
import { UseTrpcContext } from "../hooks";
import { twBigButton, twCenteringBlock } from "../utils/twCommon";
import { Loader } from "../components/Loader";

const Home: NextPage = () => {
  const {
    isUpdateRecordSuccess,
    isSetRecordSuccess,
    isDeleteRecordSuccess,
    refetchGetData,
    isReady,
  } = UseTrpcContext();
  const { data: sessionData, status } = useSession();

  useEffect(() => {
    if (isSetRecordSuccess || isDeleteRecordSuccess || isUpdateRecordSuccess) {
      refetchGetData();
    }
  }, [
    isUpdateRecordSuccess,
    isSetRecordSuccess,
    isDeleteRecordSuccess,
    refetchGetData,
  ]);

  return (
    <>
      <Head>
        <title>Komala</title>
        <meta name="description" content="Komala" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {status === "loading" ? (
          <div className={`${twCenteringBlock}`}>
            <Loader />
          </div>
        ) : null}

        {status === "unauthenticated" ? (
          <div className={`${twCenteringBlock}`}>
            <button className={`${twBigButton}`} onClick={() => signIn()}>
              sign in
            </button>
          </div>
        ) : null}

        {status === "authenticated" && sessionData?.user && isReady ? (
          <div className="align-between flex  min-h-screen flex-col text-slate-900 dark:text-white">
            <Header />
            <div className="flex flex-col gap-12 p-6">
              <RecordForm />
              <RecordsList />
            </div>
          </div>
        ) : (
          <div className={`${twCenteringBlock}`}>
            <Loader />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
