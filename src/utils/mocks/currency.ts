export type currencyResponseType = {
  meta: {
    last_updated_at: string;
  };
  data: {
    [index: string]: {
      code: string;
      value: number;
    };
  };
};

export const currencyResponse = {
  meta: {
    last_updated_at: "2022-12-19T23:59:59Z",
  },
  data: {
    EUR: {
      code: "EUR",
      value: 0.942201,
    },
    GEL: {
      code: "GEL",
      value: 2.655003,
    },
    RUB: {
      code: "RUB",
      value: 69.750114,
    },
  },
};
