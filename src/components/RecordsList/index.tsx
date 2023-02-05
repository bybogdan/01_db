import type { Record } from "@prisma/client";
import Link from "next/link";
import { memo } from "react";
import { RecordCard } from "../RecordCard";

interface IComp {
  records: Record[];
}

export const Comp: React.FC<IComp> = ({ records }) => {
  return (
    <>
      <ul className="flex w-full flex-col gap-4 px-5">
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

export const RecordsList = memo(Comp);
