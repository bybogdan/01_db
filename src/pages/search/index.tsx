import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { LoaderWithHeader } from "../../components/LoaderWIthHeader";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Search = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  const {
    isSuccess,
    isFetching,
    refetch: refetchGetData,
    data: categoriesData,
  } = trpc.record.getRecordsCategories.useQuery(
    (sessionData?.user?.id as string) || "",
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  console.log("categoriesData", categoriesData);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  if (status === "loading") {
    return <LoaderWithHeader isHide={true} />;
  }

  return categoriesData?.length
    ? categoriesData.map((category) => {
        return <div key={category}>{category}</div>;
      })
    : null;
};

export default Search;
