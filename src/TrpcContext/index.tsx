import { createContext, useCallback } from "react";
import type { ReactNode } from "react";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import type { Record } from "@prisma/client";
import type { RecordSchema } from "../server/schema/post.schema";

interface IContext {
  deleteRecord: (id: string) => void;
  isDeleteRecordSuccess: boolean;
  updateRecord: (id: string, record: RecordSchema) => void;
  isUpdateRecordMutate: boolean;
  allRecords: Record[] | undefined;
  refetchAllRecords: () => void;
  totalExpenseByCurrency:
    | {
        [key: string]: number;
      }
    | undefined;
  refetchTotalExpense: () => void;
  setRecord: (data: RecordSchema) => void;
  isSetRecordSuccess: boolean;
}

interface IContextProvider {
  children: ReactNode;
}

const defaultContextValue = {
  deleteRecord: () => {
    return;
  },
  updateRecord: () => {
    return;
  },
  isDeleteRecordSuccess: false,
  isUpdateRecordMutate: false,
  allRecords: undefined,
  refetchAllRecords: () => {
    return;
  },
  totalExpenseByCurrency: undefined,
  refetchTotalExpense: () => {
    return;
  },
  setRecord: () => {
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

  const updateRecordMutate = trpc.record.updateRecord.useMutation();

  const refetchAllRecords = useCallback(() => {
    getAllRecordsQuery.refetch();
  }, []);

  const deleteRecord = useCallback((id: string) => {
    deleteRecordMutate.mutate(id);
  }, []);

  const updateRecord = useCallback((id: string, record: RecordSchema) => {
    updateRecordMutate.mutate({ id, updRecordData: record });
  }, []);

  const setRecord = useCallback((data: RecordSchema) => {
    setRecordMutate.mutate(data);
  }, []);

  const refetchTotalExpense = useCallback(() => {
    totalExpenseQuery.refetch();
  }, []);

  const value = {
    deleteRecord,
    isDeleteRecordSuccess: deleteRecordMutate.isSuccess,
    updateRecord,
    isUpdateRecordMutate: updateRecordMutate.isSuccess,
    allRecords: getAllRecordsQuery.data,
    refetchAllRecords,
    totalExpenseByCurrency: totalExpenseQuery.data,
    refetchTotalExpense,
    setRecord,
    isSetRecordSuccess: setRecordMutate.isSuccess,
  };

  return <TrpcContext.Provider value={value}>{children}</TrpcContext.Provider>;
};
