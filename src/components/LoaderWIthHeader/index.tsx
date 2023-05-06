import Image from "next/image";
import { twCenteringBlock } from "../../utils/twCommon";
import { Header } from "../Header";

export const LoaderWithHeader = ({
  userName = "",
  userId = "",
  isHide,
}: {
  userName?: string;
  userId?: string;
  message?: string;
  isHide?: boolean;
}) => {
  return (
    <div className="align-between relative flex min-h-screen flex-col gap-12 p-6 text-slate-900 dark:text-white">
      <Header
        userName={userName}
        userId={userId}
        homePageHref="/"
        isHide={isHide}
      />

      <div className="fixed top-0 left-0 h-full w-full ">
        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2  flex-col gap-2">
          <div className="animate-fast-pulse">
            <Image
              alt="icon"
              src="/icon-192x192-transparent.png"
              width={75}
              height={75}
              priority={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
