import getSymbolFromCurrency from "currency-symbol-map";
import { toast } from "react-hot-toast";

export interface ISelectOption {
  value: string;
  label: string;
}

export const voidFunction = () => {
  return;
};

export const funcPlaceholder = () => {
  return;
};

export const preapreDataForSelect = (data: string[]) => {
  return data.map((item) => ({
    value: item,
    label: item,
  }));
};

export const capitalizeString = (string: string) => {
  const lowerCaseString = string.toLowerCase().trim();
  return lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);
};

export const getCurrencySymbol = (currency: string) => {
  return getSymbolFromCurrency(currency) || currency;
};

export const getCurrencySymbolOrNothing = (currency: string) => {
  return getSymbolFromCurrency(currency) || "";
};

export const numToFloat = (num: number) => {
  return num.toFixed(2);
};

export const defaultCategories = [
  "FOOD",
  "TRANSPORT",
  "RENT",
  "UTILITY PAYMENT",
  "SALARY",
];
export const defaultTags: string[] = [];

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
  "RUB",
  "TRY",
  // "GBR",
  // "UAH",
];

export const showError = (message: string) => {
  toast.error(message, {
    duration: 1000,
  });
};

export const ALL_CURRENCIES = [
  {
    code: "ADA",
    name: "Cardano",
  },
  {
    code: "AED",
    name: "United Arab Emirates Dirham",
  },
  {
    code: "AFN",
    name: "Afghan Afghani",
  },
  {
    code: "ALL",
    name: "Albanian Lek",
  },
  {
    code: "AMD",
    name: "Armenian Dram",
  },
  {
    code: "ANG",
    name: "Netherlands Antillean Guilder",
  },
  {
    code: "AOA",
    name: "Angolan Kwanza",
  },
  {
    code: "ARS",
    name: "Argentine Peso",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
  },
  {
    code: "AWG",
    name: "Aruban Florin",
  },
  {
    code: "AVAX",
    name: "Avalanche",
  },
  {
    code: "AZN",
    name: "Azerbaijani Manat",
  },
  {
    code: "BAM",
    name: "Bosnia-Herzegovina Convertible Mark",
  },
  {
    code: "BBD",
    name: "Barbadian Dollar",
  },
  {
    code: "BDT",
    name: "Bangladeshi Taka",
  },
  {
    code: "BGN",
    name: "Bulgarian Lev",
  },
  {
    code: "BHD",
    name: "Bahraini Dinar",
  },
  {
    code: "BIF",
    name: "Burundian Franc",
  },
  {
    code: "BMD",
    name: "Bermudan Dollar",
  },
  {
    code: "BND",
    name: "Brunei Dollar",
  },
  {
    code: "BOB",
    name: "Bolivian Boliviano",
  },
  {
    code: "BRL",
    name: "Brazilian Real",
  },
  {
    code: "BSD",
    name: "Bahamian Dollar",
  },
  {
    code: "BTC",
    name: "Bitcoin",
  },
  {
    code: "BTN",
    name: "Bhutanese Ngultrum",
  },
  {
    code: "BWP",
    name: "Botswanan Pula",
  },
  {
    code: "BYN",
    name: "Belarusian Ruble",
  },
  {
    code: "BYR",
    name: "Belarusian Ruble",
  },
  {
    code: "BZD",
    name: "Belize Dollar",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
  },
  {
    code: "CDF",
    name: "Congolese Franc",
  },
  {
    code: "CHF",
    name: "Swiss Franc",
  },
  {
    code: "CLF",
    name: "Chilean Unit of Account (UF)",
  },
  {
    code: "CLP",
    name: "Chilean Peso",
  },
  {
    code: "CNH",
    name: "Chinese Yuan (Offshore)",
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
  },
  {
    code: "COP",
    name: "Colombian Peso",
  },
  {
    code: "CRC",
    name: "Costa Rican Colón",
  },
  {
    code: "CUC",
    name: "Cuban Convertible Peso",
  },
  {
    code: "CUP",
    name: "Cuban Peso",
  },
  {
    code: "CVE",
    name: "Cape Verdean Escudo",
  },
  {
    code: "CZK",
    name: "Czech Republic Koruna",
  },
  {
    code: "DJF",
    name: "Djiboutian Franc",
  },
  {
    code: "DKK",
    name: "Danish Krone",
  },
  {
    code: "DOP",
    name: "Dominican Peso",
  },
  {
    code: "DOT",
    name: "Polkadot",
  },
  {
    code: "DZD",
    name: "Algerian Dinar",
  },
  {
    code: "EGP",
    name: "Egyptian Pound",
  },
  {
    code: "ERN",
    name: "Eritrean Nakfa",
  },

  {
    code: "ETB",
    name: "Ethiopian Birr",
  },
  {
    code: "ETH",
    name: "Ethereum",
  },
  {
    code: "EUR",
    name: "Euro",
  },
  {
    code: "FJD",
    name: "Fijian Dollar",
  },

  {
    code: "FKP",
    name: "Falkland Islands Pound",
  },
  {
    code: "GBP",
    name: "British Pound Sterling",
  },
  {
    code: "GEL",
    name: "Georgian Lari",
  },
  {
    code: "GGP",
    name: "Guernsey Pound",
  },
  {
    code: "GHS",
    name: "Ghanaian Cedi",
  },
  {
    code: "GIP",
    name: "Gibraltar Pound",
  },
  {
    code: "GMD",
    name: "Gambian Dalasi",
  },
  {
    code: "GNF",
    name: "Guinean Franc",
  },
  {
    code: "GTQ",
    name: "Guatemalan Quetzal",
  },
  {
    code: "GYD",
    name: "Guyanaese Dollar",
  },
  {
    code: "HKD",
    name: "Hong Kong Dollar",
  },
  {
    code: "HNL",
    name: "Honduran Lempira",
  },
  {
    code: "HTG",
    name: "Haitian Gourde",
  },
  {
    code: "HUF",
    name: "Hungarian Forint",
  },
  {
    code: "IDR",
    name: "Indonesian Rupiah",
  },
  {
    code: "ILS",

    name: "Israeli New Sheqel",
  },
  {
    code: "IMP",
    name: "Isle of Man Pound",
  },
  {
    code: "INR",
    name: "Indian Rupee",
  },
  {
    code: "IQD",
    name: "Iraqi Dinar",
  },
  {
    code: "IRR",
    name: "Iranian Rial",
  },
  {
    code: "ISK",
    name: "Icelandic Króna",
  },
  {
    code: "JEP",
    name: "Jersey Pound",
  },
  {
    code: "JMD",
    name: "Jamaican Dollar",
  },
  {
    code: "JOD",
    name: "Jordanian Dinar",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
  },
  {
    code: "KES",
    name: "Kenyan Shilling",
  },
  {
    code: "KGS",
    name: "Kyrgystani Som",
  },
  {
    code: "KHR",
    name: "Cambodian Riel",
  },
  {
    code: "KMF",
    name: "Comorian Franc",
  },
  {
    code: "KPW",
    name: "North Korean Won",
  },
  {
    code: "KRW",
    name: "South Korean Won",
  },
  {
    code: "KWD",
    name: "Kuwaiti Dinar",
  },
  {
    code: "KYD",
    name: "Cayman Islands Dollar",
  },
  {
    code: "KZT",
    name: "Kazakhstani Tenge",
  },
  {
    code: "LAK",
    name: "Laotian Kip",
  },
  {
    code: "LBP",
    name: "Lebanese Pound",
  },
  {
    code: "LKR",
    name: "Sri Lankan Rupee",
  },
  {
    code: "LRD",
    name: "Liberian Dollar",
  },
  {
    code: "LSL",
    name: "Lesotho Loti",
  },
  {
    code: "LTC",
    name: "Litecoin",
  },
  {
    code: "LYD",
    name: "Libyan Dinar",
  },
  {
    code: "MAD",
    name: "Moroccan Dirham",
  },
  {
    code: "MDL",
    name: "Moldovan Leu",
  },
  {
    code: "MGA",
    name: "Malagasy Ariary",
  },
  {
    code: "MKD",
    name: "Macedonian Denar",
  },
  {
    code: "MMK",
    name: "Myanma Kyat",
  },
  {
    code: "MNT",
    name: "Mongolian Tugrik",
  },
  {
    code: "MOP",
    name: "Macanese Pataca",
  },
  {
    code: "MRO",
    name: "Mauritanian Ouguiya",
  },
  {
    code: "MRU",
    name: "Mauritanian Ouguiya",
  },
  {
    code: "MUR",
    name: "Mauritian Rupee",
  },
  {
    code: "MVR",
    name: "Maldivian Rufiyaa",
  },
  {
    code: "MWK",
    name: "Malawian Kwacha",
  },
  {
    code: "MXN",
    name: "Mexican Peso",
  },
  {
    code: "MYR",
    name: "Malaysian Ringgit",
  },
  {
    code: "MZN",
    name: "Mozambican Metical",
  },
  {
    code: "NAD",
    name: "Namibian Dollar",
  },
  {
    code: "NGN",
    name: "Nigerian Naira",
  },
  {
    code: "NIO",
    name: "Nicaraguan Córdoba",
  },
  {
    code: "NOK",
    name: "Norwegian Krone",
  },
  {
    code: "NPR",
    name: "Nepalese Rupee",
  },
  {
    code: "NZD",
    name: "New Zealand Dollar",
  },
  {
    code: "OMR",
    name: "Omani Rial",
  },
  {
    code: "PAB",
    name: "Panamanian Balboa",
  },
  {
    code: "PEN",
    name: "Peruvian Nuevo Sol",
  },
  {
    code: "PGK",

    name: "Papua New Guinean Kina",
  },
  {
    code: "PHP",
    name: "Philippine Peso",
  },
  {
    code: "PKR",
    name: "Pakistani Rupee",
  },
  {
    code: "PLN",
    name: "Polish Zloty",
  },
  {
    code: "PYG",
    name: "Paraguayan Guarani",
  },
  {
    code: "QAR",
    name: "Qatari Rial",
  },
  {
    code: "RON",
    name: "Romanian Leu",
  },
  {
    code: "RSD",
    name: "Serbian Dinar",
  },
  {
    code: "RUB",
    name: "Russian Ruble",
  },
  {
    code: "RWF",
    name: "Rwandan Franc",
  },
  {
    code: "SAR",
    name: "Saudi Riyal",
  },
  {
    code: "SBD",
    name: "Solomon Islands Dollar",
  },
  {
    code: "SCR",

    name: "Seychellois Rupee",
  },
  {
    code: "SDG",
    name: "Sudanese Pound",
  },
  {
    code: "SEK",
    name: "Swedish Krona",
  },
  {
    code: "SGD",
    name: "Singapore Dollar",
  },
  {
    code: "SHP",
    name: "Saint Helena Pound",
  },
  {
    code: "SLL",
    name: "Sierra Leonean Leone",
  },
  {
    code: "SOS",

    name: "Somali Shilling",
  },
  {
    code: "SRD",
    name: "Surinamese Dollar",
  },
  {
    code: "SSP",
    name: "South Sudanese Pound",
  },
  {
    code: "STD",

    name: "São Tomé and Príncipe Dobra",
  },
  {
    code: "STN",
    name: "São Tomé and Príncipe Dobra",
  },
  {
    code: "SVC",

    name: "Salvadoran Colón",
  },
  {
    code: "SYP",
    name: "Syrian Pound",
  },
  {
    code: "SZL",
    name: "Swazi Lilangeni",
  },
  {
    code: "THB",
    name: "Thai Baht",
  },
  {
    code: "TJS",
    name: "Tajikistani Somoni",
  },
  {
    code: "TMT",
    name: "Turkmenistani Manat",
  },
  {
    code: "TND",
    name: "Tunisian Dinar",
  },
  {
    code: "TOP",
    name: "Tongan Paʻanga",
  },
  {
    code: "TRY",
    name: "Turkish Lira",
  },
  {
    code: "TTD",
    name: "Trinidad and Tobago Dollar",
  },
  {
    code: "TWD",
    name: "New Taiwan Dollar",
  },
  {
    code: "TZS",
    name: "Tanzanian Shilling",
  },
  {
    code: "UAH",
    name: "Ukrainian Hryvnia",
  },
  {
    code: "UGX",
    name: "Ugandan Shilling",
  },
  {
    code: "USD",
    name: "United States Dollar",
  },
  {
    code: "UYU",
    name: "Uruguayan Peso",
  },
  {
    code: "UZS",
    name: "Uzbekistan Som",
  },
  {
    code: "VEF",
    name: "Venezuelan Bolívar Fuerte",
  },
  {
    code: "VES",
    name: "Venezuelan Bolívar Soberano",
  },
  {
    code: "VND",
    name: "Vietnamese Dong",
  },
  {
    code: "VUV",
    name: "Vanuatu Vatu",
  },
  {
    code: "WST",
    name: "Samoan Tala",
  },
  {
    code: "XAF",
    name: "Central African CFA franc",
  },
  {
    code: "XAG",
    name: "Silver (troy ounce)",
  },
  {
    code: "XAU",
    name: "Gold (troy ounce)",
  },
  {
    code: "XCD",
    name: "East Caribbean Dollar",
  },
  {
    code: "XDR",
    name: "Special Drawing Rights",
  },
  {
    code: "XOF",
    name: "West African CFA franc",
  },
  {
    code: "XPD",
    name: "Palladium (troy ounce)",
  },
  {
    code: "XPF",
    name: "CFP Franc",
  },
  {
    code: "XPT",
    name: "Platinum (troy ounce)",
  },
  {
    code: "YER",
    name: "Yemeni Rial",
  },
  {
    code: "ZAR",
    name: "South African Rand",
  },
  {
    code: "ZMW",
    name: "Zambian Kwacha",
  },
  {
    code: "ZWL",
    name: "Zimbabwean Dollar",
  },
];
