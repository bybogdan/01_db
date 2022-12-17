import { useTrpcContext } from "../../hooks";
import { RecordCard } from "../RecordCard";

export const RecordsList: React.FC = () => {
  const { data } = useTrpcContext();

  const { records } = data || {};

  return (
    <>
      <ul className="flex w-full flex-col gap-2 px-5">
        {records
          ? records.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))
          : null}
      </ul>
    </>
  );
};
