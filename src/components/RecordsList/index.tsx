import { useTrpcContext } from "../../hooks";
import { RecordCard } from "../RecordCard";

export const RecordsList: React.FC = () => {
  const { allRecords } = useTrpcContext();

  return (
    <>
      {allRecords
        ? allRecords.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))
        : null}
    </>
  );
};
