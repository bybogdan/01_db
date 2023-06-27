import type { Record } from "@prisma/client";
import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import type { recordsByType } from "../../server/trpc/router/record";
import { capitalizeString, getMonthName } from "../../utils/common";
import { twMinWidthButton } from "../../utils/twCommon";
import { BalanceAmount } from "../BalanceAmount";
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
  checkScroll: number;
}

export const Comp: React.FC<IComp> = ({ data, checkScroll }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [month, recordData] = data;

  const [showRecords, setShowRecords] = useState(false);

  const balance = +(recordData.income - recordData.expense || 0);

  useEffect(() => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) {
      const { top, height, left, width } = rect;
      if (left > 0 && left + width < window.innerWidth) {
        if (window.innerHeight > top + height) {
          document.body.style.maxHeight = `${top + height}px`;
          document.body.style.overflowY = "hidden";
        } else {
          document.body.style.overflowY = "";
          document.body.style.maxHeight = "";
        }
      }
    }
  }, [checkScroll]);

  return (
    <div ref={wrapperRef} className="flex h-fit min-w-full flex-col gap-8">
      <h5 className="text-center text-xl font-semibold leading-tight text-gray-900 dark:text-white">
        Stats for: {getMonthName(month)}
      </h5>
      <div className="flex flex-col gap-4">
        <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
          {capitalizeString("balance")}: <BalanceAmount balance={balance} />
        </h5>

        <>
          <div>
            <button
              className={`${twMinWidthButton}`}
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
                  <Link key={`record-${index}`} href={`/record/${record.id}`}>
                    <RecordCard showCategory record={record} />
                  </Link>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-col gap-4 ">
            {Object.entries(recordData.recordsByType)
              .sort()
              .map(([type, data], index) => (
                <StatsCategories
                  key={`stats-type-${index}`}
                  type={type}
                  data={data.recordsByCategories}
                  totalAmount={data.amount}
                />
              ))}
          </div>
        </>
      </div>
    </div>
  );
};

export const StatsMonth = memo(Comp);
