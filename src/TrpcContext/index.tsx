import { createContext, useCallback } from "react";
import type { ReactNode } from "react";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import type { Record } from "@prisma/client";
import type { SetRecordType } from "../types";

interface IContext {
  deleteRecord: (id: string) => void;
  isDeleteRecordSuccess: boolean;
  allRecords: Record[] | undefined;
  refetchAllRecords: () => void;
  totalExpenseByCurrency:
    | {
        [key: string]: number;
      }
    | undefined;
  refetchTotalExpense: () => void;
  setRecord: (data: SetRecordType) => void;
  isSetRecordSuccess: boolean;
}

interface IContextProvider {
  children: ReactNode;
}

const defaultContextValue = {
  deleteRecord: () => {
    return;
  },
  isDeleteRecordSuccess: false,
  allRecords: undefined,
  refetchAllRecords: () => {
    return;
  },
  totalExpenseByCurrency: undefined,
  refetchTotalExpense: () => {
    return;
  },
  setRecord: (data: SetRecordType) => {
    return;
  },
  isSetRecordSuccess: false,
};

export const TrpcContext = createContext<IContext>(defaultContextValue);

export const TrpcContextProvider: React.FC<IContextProvider> = ({
  children,
}) => {
  const { data: sessionData } = useSession();

  const getAllRecordsQuery = trpc.record.getAll.useQuery(
    sessionData?.user?.id,
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const totalExpenseQuery = trpc.record.totalExpense.useQuery(
    sessionData?.user?.id,
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const setRecordMutate = trpc.record.setRecord.useMutation();

  const deleteRecordMutate = trpc.record.deleteRecord.useMutation();

  const refetchAllRecords = useCallback(() => {
    getAllRecordsQuery.refetch();
  }, []);

  const deleteRecord = useCallback((id: string) => {
    deleteRecordMutate.mutate(id);
  }, []);

  const setRecord = useCallback((data: SetRecordType) => {
    setRecordMutate.mutate(data);
  }, []);

  const refetchTotalExpense = useCallback(() => {
    totalExpenseQuery.refetch();
  }, []);

  const value = {
    deleteRecord,
    isDeleteRecordSuccess: deleteRecordMutate.isSuccess,
    allRecords: getAllRecordsQuery.data,
    refetchAllRecords,
    totalExpenseByCurrency: totalExpenseQuery.data,
    refetchTotalExpense,
    setRecord,
    isSetRecordSuccess: setRecordMutate.isSuccess,
  };

  return <TrpcContext.Provider value={value}>{children}</TrpcContext.Provider>;
};
