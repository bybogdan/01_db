import type { Record } from "@prisma/client";
import Link from "next/link";
import { memo, useState } from "react";

import {
  BASE_CURRENCY,
  capitalizeString,
  getCurrencySymbol,
  numToFloat,
} from "../../utils/common";
import { twButton } from "../../utils/twCommon";
import { RecordCard } from "../RecordCard";

interface IComp {
  data: {
    records: Record[];
    income: number;
    expense: number;
  };
  category: string;
}

export const Comp: React.FC<IComp> = ({ data, category }) => {
  const [showRecords, setShowRecords] = useState(false);

  return (
    <>
      <div key={`stats-${category}`} className="flex flex-col gap-4">
        <div className="flex justify-between">
          <button
            className={` ${twButton}`}
            onClick={() => setShowRecords((prev) => !prev)}
          >
            {showRecords
              ? `Hide ${capitalizeString(category)}`
              : `Show ${capitalizeString(category)}`}
          </button>
          <p className="text-base text-gray-700 dark:text-slate-200">
            {data.expense > data.income
              ? numToFloat(data.expense)
              : numToFloat(data.income)}{" "}
            {getCurrencySymbol(BASE_CURRENCY)}
          </p>
        </div>
        {showRecords ? (
          <>
            <h5 className=" text-xl leading-tight text-gray-900 dark:text-white">
              {capitalizeString(category)}:
            </h5>
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
