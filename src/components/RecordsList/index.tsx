import Link from "next/link";
import { UseTrpcContext } from "../../hooks";
import { RecordCard } from "../RecordCard";

export const RecordsList: React.FC = () => {
  const { data } = UseTrpcContext();

  const { records } = data || {};

  return (
    <>
      <ul className="flex w-full flex-col gap-2 px-5">
        {records
          ? records.map((record) => (
              <div key={record.id}>
                <Link href={`/record/${record.id}`}>
                  <RecordCard record={record} />
                </Link>
              </div>
            ))
          : null}
      </ul>
    </>
  );
};
