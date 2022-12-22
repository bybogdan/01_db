import type { Record } from "@prisma/client";
import { useSession } from "next-auth/react";
import { memo, ReactNode, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UseTrpcContext } from "../../hooks";
import type { RecordSchema } from "../../server/schema/post.schema";
import { LoaderSize } from "../../types/misc";
import { twButton, twInput, twSelect } from "../../utils/twCommon";
import { Loader } from "../Loader";

interface IComp {
  currentRecord?: Record;
  callbackAfterSubmit?: () => void;
  discardButton?: ReactNode;
}

const Comp: React.FC<IComp> = ({
  currentRecord,
  callbackAfterSubmit,
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
    setRecord,
    updateRecord,
    isUpdateRecordSuccess,
    isUpdateRecordLoading,
    isSetRecordSuccess,
  } = UseTrpcContext();
  const { data: sessionData } = useSession();

  const { register, handleSubmit, reset } = useForm<RecordSchema>({
    shouldUseNativeValidation: true,
    defaultValues,
  });

  const onSubmit = async (data: RecordSchema) => {
    if (!sessionData?.user?.id) {
      throw new Error("You are unauthorized");
    }
    if (currentRecord) {
      updateRecord(currentRecord.id, { ...data, userId: currentRecord.userId });
    } else {
      setRecord({
        ...data,
        userId: sessionData?.user?.id,
      });
    }
    reset();
    if (callbackAfterSubmit) {
      callbackAfterSubmit();
    }
  };

  // const closeForm = useCallback(() => {
  //   reset();
  //   if (callbackAfterSubmit) {
  //     callbackAfterSubmit();
  //   }
  // }, [callbackAfterSubmit, reset]);

  // useEffect(() => {
  //   if (isUpdateRecordSuccess) {
  //     closeForm();
  //   }
  // }, [isUpdateRecordSuccess, closeForm]);

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
            required: "Please enter your first name.",
          })}
        />
        <select
          className={`absolute ${twSelect} right-0 w-fit bg-gray-100`}
          style={{ top: "50%", transform: "translate(0, -50%)" }}
          placeholder="currency"
          defaultValue="USD"
          {...register("currency", {
            required: "Please enter your first name.",
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
          required: "Please enter your first name.",
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
          required: "Please enter your first name.",
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
          type="submit"
          className={`grow ${twButton}`}
          disabled={isUpdateRecordLoading}
        >
          {!isUpdateRecordLoading ? "save" : <Loader size={LoaderSize.SMALL} />}
        </button>
        {discardButton ? discardButton : null}
      </div>
    </form>
  );
};

export const RecordForm = memo(Comp);
