import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

import { useEffect } from "react";
import Image from "next/image";

import CurrencyAPI from "@everapi/currencyapi-js";

import { env } from "../env/client.mjs";

import { UserInfo } from "../components/UserInfo";
import { RecordForm } from "../components/RecordForm";
import { RecordsList } from "../components/RecordsList";
import { UseTrpcContext } from "../hooks";
import { twBigButton } from "../utils/twCommon";
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
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        {status === "loading" ? <Loader /> : null}

        {status === "unauthenticated" ? (
          <button className={`${twBigButton}`} onClick={() => signIn()}>
            sign in
          </button>
        ) : null}

        {status === "authenticated" ? (
          sessionData?.user && isReady ? (
            <>
              <UserInfo />
              <div className="pt-4" />
              <RecordForm />
              <div className="pt-4" />
              <RecordsList />
            </>
          ) : (
            <Loader />
          )
        ) : null}
      </>
    </>
  );
};

export default Home;
