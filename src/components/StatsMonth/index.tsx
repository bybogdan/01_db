import type { Record } from "@prisma/client";
import { memo, useState } from "react";
import type { recordsByCategroriesType } from "../../server/trpc/router/record";
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
      recordsByCategories: recordsByCategroriesType;
    }
  ];
}

export const Comp: React.FC<IComp> = ({ data }) => {
  const [month, recordData] = data;

  const [showStat, setShowStat] = useState(false);
  const [showRecords, setShowRecords] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <h5 className=" text-xl leading-tight text-gray-900 dark:text-white">
        Stats for: {getMonthName(month)}
      </h5>
      <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
        {capitalizeString("balance")}:{" "}
        {numToFloat(recordData.income - recordData.expense)}{" "}
        {getCurrencySymbol(BASE_CURRENCY)}
      </h5>
      <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
        {capitalizeString("income")}: {numToFloat(recordData.income)}{" "}
        {getCurrencySymbol(BASE_CURRENCY)}
      </h5>
      <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
        {capitalizeString("expense")}: {numToFloat(recordData.expense)}{" "}
        {getCurrencySymbol(BASE_CURRENCY)}
      </h5>
      {showStat && (
        <>
          {showRecords ? (
            <>
              <hr className="my-2 border-gray-300" />
              <h5 className=" text-xl leading-tight text-gray-900 dark:text-white">
                {capitalizeString("all records")}:
              </h5>
              <ul className="flex flex-col gap-4">
                {recordData.records.map((record, index) => {
                  const formattedRecord: Record = {
                    ...record,
                    timestamp: new Date(record.timestamp),
                  };
                  return (
                    <RecordCard
                      key={`record-${index}`}
                      showCategory
                      record={formattedRecord}
                    />
                  );
                })}
              </ul>
            </>
          ) : null}
          {showRecords ? <hr className="my-2 border-gray-300" /> : null}
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
          <StatsCategories data={recordData.recordsByCategories} />
        </>
      )}
      <div>
        <button
          className={twButton}
          onClick={() => setShowStat((prev) => !prev)}
        >
          {showStat ? "Hide more" : "Show more"}
        </button>
      </div>
    </div>
  );
};

export const StatsMonth = memo(Comp);
