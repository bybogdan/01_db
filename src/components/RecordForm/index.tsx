import type { Record } from "@prisma/client";
import { ReactNode, useCallback, useEffect } from "react";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import type { RecordSchema } from "../../server/schema/post.schema";
import { LoaderSize } from "../../types/misc";
import { getCurrencySymbol } from "../../utils/common";
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
  currenciesData: string[];
}

const Comp: React.FC<IComp> = ({
  sessionUserId,
  handleRefetchData,
  currentRecord,
  discardButton,
  categories,
  currenciesData,
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

  const handleOnSuccess = async () => {
    await handleRefetchData();
    setShowLoader(false);
    reset();
  };

  const { mutate: setRecord, isLoading: isSetRecordLoading } =
    trpc.record.setRecord.useMutation({
      onSuccess: handleOnSuccess,
    });

  const { mutate: updateRecord, isLoading: isUpdateRecordLoading } =
    trpc.record.updateRecord.useMutation({
      onSuccess: handleOnSuccess,
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecordSchema>({
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

  const handleErrors = useCallback(() => {
    if (!Object.keys(errors).length) {
      return;
    }

    Object.entries(errors).forEach(([, value]) => {
      toast.error(value.message as string, {
        duration: 1000,
      });
    });
  }, [errors]);

  // handling the first submission attempt
  useEffect(() => {
    if (errors) {
      handleErrors();
    }
  }, [errors, handleErrors]);

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 1000 }}
      />

      <form
        className="flex flex-col gap-y-3 "
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
          handleErrors();
        }}
      >
        <div className="relative flex gap-2">
          <input
            autoComplete="off"
            className={`${twInput}`}
            placeholder="Amount"
            type="number"
            min="0.00"
            step="0.01"
            {...register("amount", {
              required: "Fill amount (only number)",
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
            {currenciesData.map((currency) => (
              <option key={currency} value={currency}>
                {currency} {getCurrencySymbol(currency)}
              </option>
            ))}
          </select>
        </div>

        <input
          autoComplete="off"
          className={`${twInput}`}
          placeholder="Name"
          {...register("name", {
            required: "Name must be filled",
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
        <div
          className={`flex gap-2 ${discardButton ? "flex-row-reverse" : ""}`}
        >
          <button
            disabled={isSetRecordLoading || isUpdateRecordLoading}
            type="submit"
            className={`grow ${twButton}`}
          >
            {isShowLoader ? <Loader size={LoaderSize.SMALL} /> : "Save"}
          </button>
          {discardButton ? discardButton : null}
        </div>
      </form>
    </>
  );
};

export const RecordForm = memo(Comp);
