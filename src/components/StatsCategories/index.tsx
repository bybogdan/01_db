import { memo } from "react";
import type { recordsByCategroriesType } from "../../server/trpc/router/record";
import {
  BASE_CURRENCY,
  capitalizeString,
  getCurrencySymbol,
  numToFloat,
} from "../../utils/common";
import { StatsCategory } from "../StatsCategory";

interface IComp {
  data: recordsByCategroriesType;
  totalAmount: number;
  type: string;
  handleCheckScroll: () => void;
}

export const Comp: React.FC<IComp> = ({
  data,
  totalAmount,
  type,
  handleCheckScroll,
}) => {
  const sortedData = Object.entries(data).sort(([, data1], [, data2]) => {
    const value1 = data1.income > data1.expense ? data1.income : data1.expense;
    const value2 = data2.income > data2.expense ? data2.income : data2.expense;

    if (value1 < value2) {
      return 1;
    }
    if (value1 > value2) {
      return -1;
    }
    return 0;
  });

  return (
    <>
      <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
        {capitalizeString(type)}: {numToFloat(totalAmount)}{" "}
        {getCurrencySymbol(BASE_CURRENCY)}
      </h5>

      {sortedData.map(([category, data], index) => (
        <StatsCategory
          key={`category-${index}`}
          category={category}
          data={data}
          handleCheckScroll={handleCheckScroll}
        />
      ))}
    </>
  );
};

export const StatsCategories = memo(Comp);
