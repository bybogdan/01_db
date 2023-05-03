import { Header } from "../Header";

export const LoaderWithHeader = ({
  userName,
  userId,
}: {
  userName: string;
  userId: string;
}) => {
  return (
    <div className="align-between flex min-h-screen flex-col gap-12 p-6 text-slate-900 dark:text-white">
      <Header userName={userName} userId={userId} homePageHref="/" />
      <div className="flex min-w-full flex-col gap-8">
        <h5 className="text-center text-xl font-semibold leading-tight text-gray-900 dark:text-white">
          ⏳ Data is loading
        </h5>
      </div>
    </div>
  );
};
