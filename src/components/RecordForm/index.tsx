import type { Record } from "@prisma/client";
import type { ReactNode } from "react";
import { useCallback, useEffect, memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

import type { RecordSchema } from "../../server/schema/post.schema";
import { LoaderSize } from "../../types/misc";
import { getCurrencySymbol, showError } from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twButton, twInput } from "../../utils/twCommon";
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
    : {
        type: "EXPENSE",
        currency: currenciesData[0] ?? "USD",
        category: "",
      };

  const categoriesArray = categories !== null ? categories : deafultCategories;

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
    getValues,
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

    if (isOnlyAmountError && !getValues("category") && !getValues("name")) {
      showError(FORM_ERRORS.categoryAndName);
    }

    Object.entries(errors).forEach(([, value]) => {
      showError(value.message as string);
    });
  }, [errors]);

  const onSubmit = async (data: RecordSchema) => {
    const formattedAmount = data.amount?.replace(",", ".")?.replaceAll(" ", "");
    if (Number.isNaN(+formattedAmount)) {
      showError("Amount must be a number. Use [0-9], [.] or [,]");
      return;
    }
    data.amount = formattedAmount;

    if (!data.category && !data.name) {
      showError(FORM_ERRORS.categoryAndName);
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

  const typesOptions = preapreDataForSelect(["EXPENSE", "INCOME"]);
  const currenciesOptions = currenciesData.map((c) => ({
    value: c,
    label: `${c} ${getCurrencySymbol(c)}`,
  }));

  return (
    <>
      <form
        className="flex flex-col gap-y-3 "
        autoComplete="off"
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
          handleErrors();
        }}
      >
        <div className="relative flex gap-2">
          <input
            className={`${twInput}`}
            placeholder="Amount"
            inputMode="decimal"
            type="text"
            {...register("amount", {
              required: FORM_ERRORS.amount,
            })}
          />

          <Controller
            name="currency"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                options={currenciesOptions}
                value={currenciesOptions.find((c) => value === c.value)}
                onChange={(val) => onChange(val?.value)}
                isSearchable={false}
              />
            )}
          />
        </div>

        <input
          className={`${twInput}`}
          placeholder="Description"
          {...register("name", {})}
        />

        <Controller
          name="type"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              className="my-react-select-container"
              classNamePrefix="my-react-select"
              options={typesOptions}
              value={typesOptions.find((c) => value === c.value)}
              onChange={(val) => onChange(val?.value)}
              isSearchable={false}
            />
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              className="my-react-select-container"
              classNamePrefix="my-react-select"
              options={categoriesOptions}
              value={categoriesOptions.find((c) => value === c.value)}
              onChange={(val) => onChange(val?.value)}
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
