import { useAppContext } from "../../hooks";

export const RecordsList: React.FC = () => {
  const { allRecords, deleteRecord } = useAppContext();

  return (
    <>
      {allRecords
        ? allRecords.map((record) => (
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
            </div>
          ))
        : null}
    </>
  );
};
