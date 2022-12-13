export type FormInputs = {
  name: string;
  message?: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  currency: string;
};
