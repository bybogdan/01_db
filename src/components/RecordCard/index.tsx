import type { Record } from "@prisma/client";
import { useEffect, useState } from "react";
import { useTrpcContext } from "../../hooks";
import { RecordForm } from "../RecordForm";

interface IRecordCard {
  record: Record;
}

export const RecordCard: React.FC<IRecordCard> = ({ record }) => {
  const { deleteRecord } = useTrpcContext();

  const [showEditForm, setShowEditForm] = useState(false);
  const [btnText, setBtnText] = useState("update");

  return (
    <div key={record.id}>
      <p>{record.name}</p>
      <p>{record.message}</p>
      <p>{record.amount}</p>
      <p>{record.type}</p>
      <p>{record.currency}</p>
      <p>
        {record.timestamp.getDate()}.{record.timestamp.getMonth()}
      </p>
      <button
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
      </button>
      {showEditForm && (
        <RecordForm
          currentRecord={record}
          callbackAfterSubmit={() => setShowEditForm((prev) => !prev)}
        />
      )}
    </div>
  );
};
