import type { Record } from "@prisma/client";
import Link from "next/link";
import { memo, useState } from "react";

import {
  BASE_CURRENCY,
  capitalizeString,
  getCurrencySymbol,
  numToFloat,
} from "../../utils/common";
import { twMinWidthButton } from "../../utils/twCommon";
import { RecordCard } from "../RecordCard";

interface IComp {
  data: {
    records: Record[];
    income: number;
    expense: number;
  };
  category: string;
  handleCheckScroll: () => void;
}

export const Comp: React.FC<IComp> = ({
  data,
  category,
  handleCheckScroll,
}) => {
  const [showRecords, setShowRecords] = useState(false);

  return (
    <>
      <div key={`stats-${category}`} className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <button
            className={` ${twMinWidthButton}`}
            onClick={() => {
              setShowRecords((prev) => !prev);
              handleCheckScroll();
            }}
          >
            {showRecords
              ? `Hide ${capitalizeString(category)}`
              : `${capitalizeString(category)}: ${data.records.length}`}
          </button>
          <p className="whitespace-nowrap text-base text-gray-700 dark:text-slate-200">
            {data.expense > data.income
              ? numToFloat(data.expense)
              : numToFloat(data.income)}{" "}
            {getCurrencySymbol(BASE_CURRENCY)}
          </p>
        </div>
        {showRecords ? (
          <>
            {data.records.map((record, index) => (
              <Link key={`record-${index}`} href={`/record/${record.id}`}>
                <RecordCard record={record} />
              </Link>
            ))}
          </>
        ) : null}
      </div>
    </>
  );
};

export const StatsCategory = memo(Comp);
