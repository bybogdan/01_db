import type { Record } from "@prisma/client";
import type { ReactNode } from "react";
import { useCallback, useEffect, memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

import type { RecordSchema } from "../../server/schema/post.schema";
import { LoaderSize } from "../../types/misc";
import { BASE_CURRENCY, getCurrencySymbol } from "../../utils/common";
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

  const CurrencySelect = () => (
    <Controller
      control={control}
      name="currency"
      defaultValue={BASE_CURRENCY}
      render={({ field: { onChange, ...props } }) => (
        <Select.Root onValueChange={onChange} defaultValue={props.value}>
          <Select.Trigger
            className={`absolute ${twSelect} right-0 flex w-fit items-center gap-2 bg-gray-100 text-base`}
            style={{ top: "50%", transform: "translate(0, -50%)" }}
            aria-label="Food"
          >
            <Select.Value placeholder="Currency" />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal className="dark:bg-gray-100 dark:text-black">
            <Select.Content className="rounded border border-solid border-gray-300">
              <Select.ScrollUpButton>
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              <Select.Viewport>
                <Select.Group>
                  {currenciesData.map((currency) => (
                    <Select.Item
                      key={currency}
                      value={currency}
                      className="cursor-pointer rounded px-7 py-1.5 text-base leading-[25px] hover:bg-blue-600 hover:text-white"
                    >
                      <Select.ItemText>
                        {currency} {getCurrencySymbol(currency)}
                      </Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>
              <Select.ScrollDownButton />
              <Select.Arrow />
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      )}
    />
  );

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
          <CurrencySelect />
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
