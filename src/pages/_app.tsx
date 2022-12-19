import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { TrpcContextProvider } from "../TrpcContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <TrpcContextProvider>
        <div className="flex min-h-screen flex-col items-center justify-center p-6 ">
          <Component {...pageProps} />
        </div>
      </TrpcContextProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
