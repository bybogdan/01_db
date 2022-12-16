import type { Record } from "@prisma/client";
import { useSession } from "next-auth/react";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { useTrpcContext } from "../../hooks";
import type { RecordSchema } from "../../server/schema/post.schema";

interface IComp {
  currentRecord?: Record;
  callbackAfterSubmit?: () => void;
}

const Comp: React.FC<IComp> = ({ currentRecord, callbackAfterSubmit }) => {
  const defaultValues: RecordSchema | object = currentRecord
    ? {
        name: currentRecord.name,
        message: currentRecord.message as string | undefined,
        amount: currentRecord.amount,
        type: currentRecord.type,
        currency: currentRecord.currency,
      }
    : {};

  const { setRecord, updateRecord } = useTrpcContext();

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
      setRecord({ ...data, userId: sessionData?.user?.id });
    }
    reset();
    if (callbackAfterSubmit) {
      callbackAfterSubmit();
    }
  };

  return (
    <form className="flex flex-col gap-y-2" onSubmit={handleSubmit(onSubmit)}>
      <input
        placeholder="name"
        {...register("name", {
          required: "Please enter your first name.",
        })} // custom message
      />
      <input placeholder="message" {...register("message")} />
      <input
        placeholder="amount"
        type="number"
        {...register("amount", {
          required: "Please enter your first name.",
        })}
      />
      <select
        placeholder="type"
        defaultValue="EXPENSE"
        {...register("type", {
          required: "Please enter your first name.",
        })}
      >
        <option>EXPENSE</option>
        <option>INCOME</option>
      </select>
      <select
        placeholder="currency"
        defaultValue="USD"
        {...register("currency", {
          required: "Please enter your first name.",
        })}
      >
        <option>USD</option>
        <option>GLE</option>
        <option>EUR</option>
        <option>RUB</option>
      </select>
      <button className="bg-slate-100" type="submit">
        save new record
      </button>
    </form>
  );
};

export const RecordForm = memo(Comp);
