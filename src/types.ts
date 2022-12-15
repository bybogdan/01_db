export type FormInputs = {
  name: string;
  message?: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  currency: string;
};

export type SetRecordType = {
  name: string;
  message?: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  currency: string;
  userId: string;
};
