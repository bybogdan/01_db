import { memo } from "react";
import type { recordsByCategroriesType } from "../../pages/stats/[id]";
import { StatsCategory } from "../StatsCategory";

interface IComp {
  data: recordsByCategroriesType;
}

export const Comp: React.FC<IComp> = ({ data }) => (
  <>
    <h5 className=" text-xl leading-tight text-gray-900 dark:text-white">
      Categories:
    </h5>
    {Object.entries(data).map(([category, data], index) => (
      <StatsCategory
        key={`category-${index}`}
        category={category}
        data={data}
      />
    ))}
  </>
);

export const StatsCategories = memo(Comp);
