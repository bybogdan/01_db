import type { Record } from "@prisma/client";
import { memo, useState } from "react";
import type { recordsByType } from "../../server/trpc/router/record";
import {
  BASE_CURRENCY,
  capitalizeString,
  getCurrencySymbol,
  getMonthName,
  numToFloat,
} from "../../utils/common";
import { twButton } from "../../utils/twCommon";
import { RecordCard } from "../RecordCard";
import { StatsCategories } from "../StatsCategories";

interface IComp {
  data: [
    string,
    {
      records: Record[];
      income: number;
      expense: number;
      recordsByType: recordsByType;
    }
  ];
}

export const Comp: React.FC<IComp> = ({ data }) => {
  const [month, recordData] = data;

  const [showRecords, setShowRecords] = useState(false);

  return (
    <div className=" flex min-w-full flex-col gap-8">
      <h5 className=" text-center text-xl leading-tight text-gray-900 dark:text-white">
        Stats for: {getMonthName(month)}
      </h5>
      <div className="flex flex-col gap-4">
        <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
          {capitalizeString("balance")}:{" "}
          {numToFloat(recordData.income - recordData.expense)}{" "}
          {getCurrencySymbol(BASE_CURRENCY)}
        </h5>

        <>
          <div>
            <button
              className={twButton}
              onClick={() => setShowRecords((prev) => !prev)}
            >
              {showRecords
                ? "Hide all records"
                : `All records: ${recordData.records.length}`}
            </button>
          </div>
          {showRecords ? (
            <div className="flex flex-col gap-4">
              <ul className="flex flex-col gap-4">
                {recordData.records.map((record, index) => (
                  <RecordCard
                    key={`record-${index}`}
                    showCategory
                    record={record}
                  />
                ))}
              </ul>
            </div>
          ) : null}
          {showRecords ? <hr className="my-2 border-gray-300" /> : null}
          <div className="flex flex-col gap-4 ">
            {Object.entries(recordData.recordsByType).map(
              ([type, data], index) => (
                <div
                  className="flex flex-col gap-4"
                  key={`stats-type-${index}`}
                >
                  <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
                    {capitalizeString(type)}: {numToFloat(data.amount)}{" "}
                    {getCurrencySymbol(BASE_CURRENCY)}
                  </h5>
                  <StatsCategories data={data.recordsByCategories} />
                </div>
              )
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export const StatsMonth = memo(Comp);
