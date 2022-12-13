import { memo } from "react";
import type { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import type { FormInputs } from "../../types";

interface IComp {
  onSubmit: (data: FormInputs) => Promise<void>;
  register: UseFormRegister<FormInputs>;
  handleSubmit: UseFormHandleSubmit<FormInputs>;
}

const Comp: React.FC<IComp> = ({ onSubmit, register, handleSubmit }) => {
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
