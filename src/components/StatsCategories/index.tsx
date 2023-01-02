import type { Record } from "@prisma/client";
import { memo, useState } from "react";
import type { recordsByCategroriesType } from "../../pages/stats/[id]";
import { capitalizeString } from "../../utils/common";
import { twButton } from "../../utils/twCommon";
import { RecordCard } from "../RecordCard";

interface IComp {
  data: recordsByCategroriesType;
}

export const Comp: React.FC<IComp> = ({ data }) => {
  const [showRecords, setShowRecords] = useState(false);

  return (
    <>
      <h5 className=" text-xl leading-tight text-gray-900 dark:text-white">
        Categories:
      </h5>

      {Object.entries(data).map(([category, data]) => (
        <div key={`stats-${category}`} className="flex flex-col gap-4">
          {showRecords ? (
            <>
              <hr className="my-2 border-gray-300" />
              <h5 className=" text-xl leading-tight text-gray-900 dark:text-white">
                {capitalizeString(category)}:
              </h5>
            </>
          ) : null}
          {showRecords &&
            data.records.map((record, index) => {
              const formattedRecord: Record = {
                ...record,
                timestamp: new Date(record.timestamp),
              };
              return (
                <RecordCard key={`record-${index}`} record={formattedRecord} />
              );
            })}
          <div>
            <button
              className={` ${twButton}`}
              onClick={() => setShowRecords((prev) => !prev)}
            >
              {showRecords
                ? `Hide ${capitalizeString(category)}: ${data.records.length}`
                : ` ${capitalizeString(category)}: ${data.records.length}`}
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export const StatsCategories = memo(Comp);
