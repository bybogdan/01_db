import getSymbolFromCurrency from "currency-symbol-map";
import { toast } from "react-hot-toast";

export const funcPlaceholder = () => {
  return;
};

export const capitalizeString = (string: string) => {
  const lowerCaseString = string.toLowerCase().trim();
  return lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);
};

export const getCurrencySymbol = (currency: string) => {
  return getSymbolFromCurrency(currency) || currency;
};

export const numToFloat = (num: number) => {
  return num.toFixed(2);
};

export const BASE_CURRENCY = "USD";

export const getMonthName = (date: string) => {
  const [monthCode, year] = date.split(".");

  let monthName;

  switch (monthCode) {
    case "1":
      monthName = "JANUARY";
      break;
    case "2":
      monthName = "FEBRUARY";
      break;
    case "3":
      monthName = "MARCH";
      break;
    case "4":
      monthName = "APRIL";
      break;
    case "5":
      monthName = "MAY";
      break;
    case "6":
      monthName = "JUNE";
      break;
    case "7":
      monthName = "JULY";
      break;
    case "8":
      monthName = "AUGUST";
      break;
    case "9":
      monthName = "SEPTEMBER";
      break;
    case "10":
      monthName = "OCTOBER";
      break;
    case "11":
      monthName = "NOVEMBER";
      break;
    case "12":
      monthName = "DECEMBER";
      break;

    default:
      monthName = monthCode;
      break;
  }

  return `${monthName} ${year}`;
};

export const getIsStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches;

export const INCLUDED_CURRENCIES = [
  "USD",
  "EUR",
  "GEL",
  "TRY",
  // "GBR",
  "RUB",
  // "UAH",
];

export const showError = (message: string) => {
  toast.error(message, {
    duration: 1000,
  });
};
