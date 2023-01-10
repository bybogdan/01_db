import { memo } from "react";
import type { recordsByCategroriesType } from "../../server/trpc/router/record";
import { StatsCategory } from "../StatsCategory";

interface IComp {
  data: recordsByCategroriesType;
}

export const Comp: React.FC<IComp> = ({ data }) => (
  <>
    <h5 className=" text-xl leading-tight text-gray-900 dark:text-white">
      Categories:
    </h5>
    {Object.entries(data)
      .sort(([, data1], [, data2]) => {
        const value1 =
          data1.income > data1.expense ? data1.income : data1.expense;
        const value2 =
          data2.income > data2.expense ? data2.income : data2.expense;

        if (value1 < value2) {
          return 1;
        }
        if (value1 > value2) {
          return -1;
        }
        return 0;
      })
      .map(([category, data], index) => (
        <StatsCategory
          key={`category-${index}`}
          category={category}
          data={data}
        />
      ))}
  </>
);

export const StatsCategories = memo(Comp);
