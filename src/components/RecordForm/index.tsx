import type { Record } from "@prisma/client";
import type { ReactNode } from "react";
import { useCallback, useEffect, memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Select from "react-select";

import type { RecordSchema } from "../../server/schema/post.schema";
import { LoaderSize } from "../../types/misc";
import { getCurrencySymbol } from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twButton, twInput, twSelect } from "../../utils/twCommon";
import { Loader } from "../Loader";

const FORM_ERRORS = {
  amount: "Fill amount (only number)",
  currency: "Please enter currency",
  name: "Name must be filled",
  type: "Please enter type of transaction",
  category: "Fill category",
  categoryAndName: "Fill name or category",
};

const deafultCategories = [
  "FOOD",
  "TRANSPORT",
  "RENT",
  "UTILITY PAYMENT",
  "SALARY",
];

const preapreDataForSelect = (data: string[]) => {
  return data.map((item) => ({
    value: item,
    label: item,
  }));
};

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

  const showToast = (message: string) => {
    toast.error(message, {
      duration: 1000,
    });
  };

  const handleOnSuccess = async (data: Record) => {
    await handleRefetchData();
    setShowLoader(false);
    reset();
    await fetch(`/api/revalidate?secret=revalidate&route=/record/${data?.id}`);
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
    control,
  } = useForm<RecordSchema>({
    defaultValues,
  });

  const [isShowLoader, setShowLoader] = useState(false);

  const handleErrors = useCallback(() => {
    if (!Object.keys(errors).length) {
      return;
    }

    const isOnlyAmountError =
      Object.keys(errors).length === 1 && errors.amount?.message;

    if (isOnlyAmountError) {
      showToast(FORM_ERRORS.categoryAndName);
    }

    Object.entries(errors).forEach(([, value]) => {
      showToast(value.message as string);
    });
  }, [errors]);

  const onSubmit = async (data: RecordSchema) => {
    if (!data.category && !data.name) {
      showToast(FORM_ERRORS.categoryAndName);
      return;
    }

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

  // handling the first submission attempt
  useEffect(() => {
    if (errors) {
      handleErrors();
    }
  }, [errors, handleErrors]);

  const categoriesOptions = preapreDataForSelect(categoriesArray);
  categoriesOptions.unshift({ value: "", label: "Category (unselected)" });

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
              required: FORM_ERRORS.amount,
            })}
          />
          <select
            className={`absolute ${twSelect} right-0 w-fit bg-gray-100`}
            style={{ top: "50%", transform: "translate(0, -50%)" }}
            placeholder="Currency"
            defaultValue="USD"
            {...register("currency", {
              required: FORM_ERRORS.currency,
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
          {...register("name", {})}
        />

        <select
          className={`${twSelect}`}
          placeholder="Type"
          defaultValue="EXPENSE"
          {...register("type", {
            required: FORM_ERRORS.type,
          })}
        >
          <option>EXPENSE</option>
          <option>INCOME</option>
        </select>

        <Controller
          name="category"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              className="my-react-select-container"
              classNamePrefix="my-react-select"
              defaultValue={categoriesOptions[0]}
              options={categoriesOptions}
              value={categoriesOptions.find((c) => value === c.value)}
              onChange={(val) => onChange(val?.value)}
              isSearchable={false}
            />
          )}
        />

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
