export const funcPlaceholder = () => {
  return;
};

export const capitalizeString = (string: string) => {
  const lowerCaseString = string.toLowerCase().trim();
  return lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);
};

export const getCurrencySymbol = (currency: string) => {
  return (
    (currency === "GEL" && "₾") ||
    (currency === "USD" && "$") ||
    (currency === "EUR" && "€") ||
    (currency === "RUB" && "₽")
  );
};

export const numToFloat = (num: number) => {
  return num.toFixed(2);
};

export const BASE_CURRENCY = "USD";
