import {
  BASE_CURRENCY,
  getCurrencySymbol,
  numToFloat,
} from "../../utils/common";

interface IBalance {
  balance: number;
}

export const BalanceAmount: React.FC<IBalance> = ({ balance }) => {
  return (
    <span
      className={`${
        balance > 0 ? "text-green-500" : balance === 0 ? "" : "text-red-500"
      }`}
    >
      {balance > 0 ? "+" : ""}
      {numToFloat(balance)} {getCurrencySymbol(BASE_CURRENCY)}
    </span>
  );
};
