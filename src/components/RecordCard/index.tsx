import type { Record } from "@prisma/client";
import { useEffect, useState } from "react";
import { UseTrpcContext } from "../../hooks";
import { getCurrencySymbol, numToFloat } from "../../utils/common";
import { RecordForm } from "../RecordForm";

interface IRecordCard {
  record: Record;
}

export const RecordCard: React.FC<IRecordCard> = ({ record }) => {
  const { deleteRecord } = UseTrpcContext();

  const [showEditForm, setShowEditForm] = useState(false);
  const [btnText, setBtnText] = useState("update");

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

      {/* <button
        className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={() => deleteRecord(record.id)}
      >
        delete
      </button>
      <button
        className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={() => setShowEditForm((prev) => !prev)}
        disabled={showEditForm}
      >
        {btnText}
      </button> */}
      {showEditForm && (
        <RecordForm
          currentRecord={record}
          callbackAfterSubmit={() => setShowEditForm((prev) => !prev)}
        />
      )}
    </li>
  );
};
