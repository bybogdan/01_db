import type { Record } from "@prisma/client";
import type { ReactNode } from "react";
import { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { RecordSchema } from "../../server/schema/post.schema";
import { LoaderSize } from "../../types/misc";
import { trpc } from "../../utils/trpc";
import { twButton, twInput, twSelect } from "../../utils/twCommon";
import { Loader } from "../Loader";

const deafultCategories = [
  "FOOD",
  "TRANSPORT",
  "RENT",
  "UTILITY PAYMENT",
  "SALARY",
];

interface IComp {
  sessionUserId: string;
  handleRefetchData: () => Promise<void>;
  isFetchingInParentComp?: boolean;
  currentRecord?: Record;
  discardButton?: ReactNode;
  categories: string[] | null;
}

const Comp: React.FC<IComp> = ({
  sessionUserId,
  handleRefetchData,
  currentRecord,
  discardButton,
  categories,
}) => {
  const defaultValues: RecordSchema | object = currentRecord
    ? {
        name: currentRecord.name,
        message: currentRecord.message as string | undefined,
        amount: currentRecord.amount,
        type: currentRecord.type,
        currency: currentRecord.currency,
        category: currentRecord.category,
      }
    : {};

  const categoriesArray = categories !== null ? categories : deafultCategories;

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

  const [isShowLoader, setShowLoader] = useState(false);

  const onSubmit = async (data: RecordSchema) => {
    if (currentRecord) {
      updateRecord({
        id: currentRecord.id,
        updRecordData: { ...data, userId: sessionUserId },
        oldCurrency: currentRecord.currency,
        oldAmount: currentRecord.amount,
        oldAmountUSD: currentRecord.amountUSD,
      });
    } else {
      setRecord({
        ...data,
        userId: sessionUserId,
      });
    }
    setShowLoader(true);
  };

  useEffect(() => {
    (async () => {
      if (isUpdateRecordSuccess || isSetRecordSuccess) {
        await handleRefetchData();
        setShowLoader(false);
        reset();
      }
    })();
  }, [isUpdateRecordSuccess, isSetRecordSuccess, handleRefetchData, reset]);

  return (
    <form className="flex flex-col gap-y-3 " onSubmit={handleSubmit(onSubmit)}>
      <div className="relative flex gap-2">
        <input
          autoComplete="off"
          className={`${twInput}`}
          placeholder="Amount"
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
          placeholder="Currency"
          defaultValue="USD"
          {...register("currency", {
            required: "Please enter currency",
          })}
        >
          <option value="USD">USD $</option>
          <option value="GEL">GEL ₾</option>
          <option value="EUR">EUR €</option>
          <option value="RUB">RUB ₽</option>
          <option value="TRY">TRY ₺</option>
        </select>
      </div>

      <input
        autoComplete="off"
        className={`${twInput}`}
        placeholder="Name"
        {...register("name", {
          required: "Please enter label for transaction",
        })}
      />

      <select
        className={`${twSelect}`}
        placeholder="Type"
        defaultValue="EXPENSE"
        {...register("type", {
          required: "Please enter type of transaction",
        })}
      >
        <option>EXPENSE</option>
        <option>INCOME</option>
      </select>

      <select
        className={`${twSelect}`}
        placeholder="Category"
        defaultValue=""
        {...register("category", {})}
      >
        <option value="">Category (unselected)</option>
        {categoriesArray.map((category, index) => (
          <option key={`category-${index}`}>{category}</option>
        ))}
      </select>

      {/* <input
        autoComplete="off"
        className={`${twInput}`}
        placeholder="message"
        {...register("message")}
      /> */}
      <div className={`flex gap-2 ${discardButton ? "flex-row-reverse" : ""}`}>
        <button
          disabled={isSetRecordLoading || isUpdateRecordLoading}
          type="submit"
          className={`grow ${twButton}`}
        >
          {isShowLoader ? <Loader size={LoaderSize.SMALL} /> : "save"}
        </button>
        {discardButton ? discardButton : null}
      </div>
    </form>
  );
};

export const RecordForm = memo(Comp);
