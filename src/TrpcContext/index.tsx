import { createContext, useCallback } from "react";
import type { ReactNode } from "react";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import type { Record } from "@prisma/client";
import type { RecordSchema } from "../server/schema/post.schema";
import { funcPlaceholder } from "../utils/common";

interface IContext {
  deleteRecord: (id: string) => void;
  isDeleteRecordSuccess: boolean;
  updateRecord: (id: string, record: RecordSchema) => void;
  isUpdateRecordSuccess: boolean;
  setRecord: (data: RecordSchema) => void;
  isSetRecordSuccess: boolean;
  data:
    | {
        records: Record[] | never[] | undefined;
        totalExpenseByCurrency: {
          [key: string]: number;
        };
      }
    | undefined;
  refetchGetData: () => void;
  isReady: boolean;
}

interface IContextProvider {
  children: ReactNode;
}

const defaultContextValue = {
  deleteRecord: funcPlaceholder,
  updateRecord: funcPlaceholder,
  isDeleteRecordSuccess: false,
  isUpdateRecordSuccess: false,
  setRecord: funcPlaceholder,
  isSetRecordSuccess: false,
  data: undefined,
  refetchGetData: funcPlaceholder,
  isReady: false,
};

export const TrpcContext = createContext<IContext>(defaultContextValue);

export const TrpcContextProvider: React.FC<IContextProvider> = ({
  children,
}) => {
  const { data: sessionData } = useSession();

  const getDataQuery = trpc.record.getData.useQuery(sessionData?.user?.id, {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const setRecordMutate = trpc.record.setRecord.useMutation();

  const deleteRecordMutate = trpc.record.deleteRecord.useMutation();

  const updateRecordMutate = trpc.record.updateRecord.useMutation();

  const deleteRecord = useCallback((id: string) => {
    deleteRecordMutate.mutate(id);
  }, []);

  const updateRecord = useCallback((id: string, record: RecordSchema) => {
    updateRecordMutate.mutate({ id, updRecordData: record });
  }, []);

  const setRecord = useCallback((data: RecordSchema) => {
    setRecordMutate.mutate(data);
  }, []);

  const refetchGetData = useCallback(() => {
    getDataQuery.refetch();
  }, []);

  const value = {
    data: getDataQuery.data,
    refetchGetData,
    deleteRecord,
    isDeleteRecordSuccess: deleteRecordMutate.isSuccess,
    updateRecord,
    isUpdateRecordSuccess: updateRecordMutate.isSuccess,
    setRecord,
    isSetRecordSuccess: setRecordMutate.isSuccess,
    isReady: getDataQuery.isSuccess,
  };

  return <TrpcContext.Provider value={value}>{children}</TrpcContext.Provider>;
};
