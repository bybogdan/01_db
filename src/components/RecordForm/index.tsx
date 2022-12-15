import { useSession } from "next-auth/react";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../hooks";
import type { FormInputs } from "../../types";

const Comp: React.FC = () => {
  const { setRecord } = useAppContext();

  const { data: sessionData } = useSession();

  const { register, handleSubmit, reset } = useForm<FormInputs>({
    shouldUseNativeValidation: true,
  });

  const onSubmit = async (data: FormInputs) => {
    if (!sessionData?.user?.id) {
      throw new Error("You are unauthorized");
    }
    setRecord({ ...data, userId: sessionData?.user?.id });
    reset();
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
