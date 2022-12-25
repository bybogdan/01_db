import type { Record } from "@prisma/client";

import { memo, ReactNode, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import type { RecordSchema } from "../../server/schema/post.schema";
import { LoaderSize } from "../../types/misc";
import { trpc } from "../../utils/trpc";
import { twButton, twInput, twSelect } from "../../utils/twCommon";
import { Loader } from "../Loader";

interface IComp {
  sessionUserId: string;
  handleRefetchData: (afterRefetchCallback: () => void) => void;
  isFetchingInParentComp?: boolean;
  currentRecord?: Record;
  discardButton?: ReactNode;
}

const Comp: React.FC<IComp> = ({
  sessionUserId,
  handleRefetchData,
  isFetchingInParentComp,
  currentRecord,
  discardButton,
}) => {
  const defaultValues: RecordSchema | object = currentRecord
    ? {
        name: currentRecord.name,
        message: currentRecord.message as string | undefined,
        amount: currentRecord.amount,
        type: currentRecord.type,
        currency: currentRecord.currency,
      }
    : {};

  const {
    mutate: setRecord,
    isSuccess: isSetRecordSuccess,
    isLoading: isSetRecordLoading,
  } = trpc.record.setRecord.useMutation();

  const {
    mutate: updateRecord,
    isSuccess: isUpdateRecordSuccess,
    isLoading: isUpdateRecordLoading,
  } = trpc.record.updateRecord.useMutation();

  const { register, handleSubmit, reset } = useForm<RecordSchema>({
    shouldUseNativeValidation: true,
    defaultValues,
  });

  const onSubmit = async (data: RecordSchema) => {
    if (currentRecord) {
      updateRecord({
        id: currentRecord.id,
        updRecordData: { ...data, userId: sessionUserId },
      });
    } else {
      setRecord({
        ...data,
        userId: sessionUserId,
      });
    }
  };

  useEffect(() => {
    if (isUpdateRecordSuccess || isSetRecordSuccess) {
      handleRefetchData(reset);
    }
  }, [isUpdateRecordSuccess, isSetRecordSuccess, handleRefetchData, reset]);

  return (
    <form className="flex flex-col gap-y-3 " onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex gap-2">
        <input
          autoComplete="off"
          className={`${twInput}`}
          placeholder="amount"
          type="number"
          min="0.00"
          step="0.01"
          {...register("amount", {
            required: "Please enter amount, formats: 100, 10.20, 0.99",
          })}
        />
        <select
          className={`absolute ${twSelect} right-0 w-fit bg-gray-100`}
          style={{ top: "50%", transform: "translate(0, -50%)" }}
          placeholder="currency"
          defaultValue="USD"
          {...register("currency", {
            required: "Please enter currency",
          })}
        >
          <option>USD</option>
          <option>GEL</option>
          <option>EUR</option>
          <option>RUB</option>
        </select>
      </div>

      <select
        className={`${twSelect}`}
        placeholder="type"
        defaultValue="EXPENSE"
        {...register("type", {
          required: "Please enter type of transaction",
        })}
      >
        <option>EXPENSE</option>
        <option>INCOME</option>
      </select>

      <input
        autoComplete="off"
        className={`${twInput}`}
        placeholder="label"
        {...register("name", {
          required: "Please enter label for transaction",
        })}
      />

      <input
        autoComplete="off"
        className={`${twInput}`}
        placeholder="message"
        {...register("message")}
      />
      <div className={`flex gap-2 ${discardButton ? "flex-row-reverse" : ""}`}>
        <button
          disabled={isSetRecordLoading || isUpdateRecordLoading}
          type="submit"
          className={`grow ${twButton}`}
        >
          {isSetRecordLoading ||
          isUpdateRecordLoading ||
          isFetchingInParentComp ? (
            <Loader size={LoaderSize.SMALL} />
          ) : (
            "save"
          )}
        </button>
        {discardButton ? discardButton : null}
      </div>
    </form>
  );
};

export const RecordForm = memo(Comp);
