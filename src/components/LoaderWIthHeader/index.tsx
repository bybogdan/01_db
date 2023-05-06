import { twCenteringBlock } from "../../utils/twCommon";
import { Header } from "../Header";
import { Loader } from "../Loader";

export const LoaderWithHeader = ({
  userName = "",
  userId = "",
  message = "Data is loading ⏳",
  isHide,
}: {
  userName?: string;
  userId?: string;
  message?: string;
  isHide?: boolean;
}) => {
  return (
    <div className="align-between flex min-h-screen flex-col gap-12 p-6 text-slate-900 dark:text-white">
      <Header
        userName={userName}
        userId={userId}
        homePageHref="/"
        isHide={isHide}
      />

      <div className={`${twCenteringBlock} -mt-20`}>
        <div className="flex flex-col gap-2">
          <Loader />
        </div>
      </div>
    </div>
  );
};
