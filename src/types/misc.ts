export enum LoaderSize {
  BASE,
  BIG,
  SMALL,
}

export enum Currency {
  USD,
  GEL,
  EUR,
  RUB,
}

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

export type HeaderStatsType = {
  [index: string]: string;
};
