import type { Record } from "@prisma/client";
import { memo } from "react";
import {
  capitalizeString,
  getCurrencySymbol,
  numToFloat,
} from "../../utils/common";

interface IComp {
  record: Record;
  showCategory?: boolean;
}

export const Comp: React.FC<IComp> = ({ record, showCategory }) => {
  return (
    <li
      className="flex flex-col	 justify-center gap-1 text-slate-900 dark:text-white"
      key={record.id}
    >
      <p className="text-base text-gray-700 dark:text-slate-200">
        {record.timestamp.getDate()}.{record.timestamp.getMonth() + 1}.
        {record.timestamp.getFullYear()}
      </p>
      <div className="flex justify-between">
        <h5 className="mb-2 max-w-[50%] text-xl font-medium leading-tight text-gray-900 dark:text-white">
          {record.name}
        </h5>
        <div
          className={`flex gap-2 ${
            record.type === "INCOME" ? "text-green-500" : ""
          }`}
        >
          <p>
            {record.type === "EXPENSE" ? "- " : "+ "}
            {numToFloat(+record.amount)}
          </p>
          <p>{getCurrencySymbol(record.currency)}</p>
        </div>
      </div>
      {showCategory && record.category && (
        <p>Category: {capitalizeString(record.category)}</p>
      )}
    </li>
  );
};

export const RecordCard = memo(Comp);
