import type { Record } from "@prisma/client";
import { memo, useEffect, useState } from "react";
import { getCurrencySymbol, numToFloat } from "../../utils/common";
import { RecordForm } from "../RecordForm";

interface IComp {
  record: Record;
}

export const Comp: React.FC<IComp> = ({ record }) => {
  return (
    <li
      className="flex flex-col	 justify-center gap-1 text-slate-900 dark:text-white"
      key={record.id}
    >
      <p className="text-base text-gray-700 dark:text-slate-200">
        {record.timestamp.getDate()}.{record.timestamp.getMonth()}.
        {record.timestamp.getFullYear()}
      </p>
      <div className="flex justify-between">
        <h5 className="mb-2 text-xl font-medium leading-tight text-gray-900 dark:text-white">
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
    </li>
  );
};

export const RecordCard = memo(Comp);
