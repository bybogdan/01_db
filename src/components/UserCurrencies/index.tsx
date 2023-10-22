import { memo, useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Select from "react-select";

import { LoaderSize } from "../../types/misc";
import {
  ALL_CURRENCIES,
  capitalizeString,
  getCurrencySymbolOrNothing,
  showError,
} from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twButton } from "../../utils/twCommon";
import { CloseIcon, CompleteIcon, DeleteIcon, MoveIcon } from "../icons";
import { Loader } from "../Loader";

interface IComp {
  currencies: string[];
  userId: string;
  refetchGetUser: () => Promise<void>;
  addQueryParamToRefetchDataOnHomePage: () => void;
}

const preparedCurrencies = ALL_CURRENCIES.map((currencyData) => {
  const symbol = getCurrencySymbolOrNothing(currencyData.code);
  return {
    value: currencyData.code,
    label: `${currencyData.code} ${symbol ? `(${symbol})` : ""} - ${
      currencyData.name
    }`,
  };
});

export const Comp: React.FC<IComp> = ({
  currencies,
  userId,
  refetchGetUser,
  addQueryParamToRefetchDataOnHomePage,
}) => {
  const [showCurrencies, setShowCurrencies] = useState(false);
  const [newCurrency, setNewCurrency] = useState("");
  const [showCurrencyLoader, setShowCurrencyLoader] = useState(false);

  const [sortableCurrencies, setSortableCurrencies] = useState(
    currencies.map((currency, i) => ({
      id: i,
      name: currency,
    }))
  );

  const { mutate: setCurrencies, isLoading: isLoadingCurrencies } =
    trpc.user.setCurrencies.useMutation({
      onSuccess: async ({ currencies }) => {
        if (!currencies.length) {
          return;
        }
        await refetchGetUser();
        setNewCurrency("");
        setSortableCurrencies(
          currencies.map((currency, i) => ({
            id: i,
            name: currency,
          }))
        );
        setShowCurrencyLoader(false);
      },
    });

  const saveNewCurrency = async () => {
    const newCurrencyName = newCurrency.toUpperCase().trim();
    if (currencies.includes(newCurrencyName)) {
      showError(`This currency already exists [${newCurrencyName}]`);
      return;
    }
    setShowCurrencyLoader(true);
    const newCurrencies = [...currencies, newCurrencyName];
    setNewCurrency("");
    setCurrencies({
      id: userId,
      currencies: newCurrencies,
    });

    addQueryParamToRefetchDataOnHomePage();
  };

  const deleteCurrency = async (index: number) => {
    currencies.splice(index, 1);
    setSortableCurrencies(
      currencies.map((currency, i) => ({
        id: i,
        name: currency,
      }))
    );
    setCurrencies({
      id: userId,
      currencies: currencies,
    });

    addQueryParamToRefetchDataOnHomePage();
  };

  const getIsCurrenciesOrderChanged = (
    updCurrencies: typeof sortableCurrencies
  ) => {
    return updCurrencies.some(({ name }, index) => {
      return name !== currencies[index];
    });
  };

  const currenicesOptions = preparedCurrencies.filter(
    ({ value }) => !currencies.includes(value)
  );

  const currenciesAsString = JSON.stringify(currencies);

  useEffect(() => {
    setSortableCurrencies(
      currencies.map((currency, i) => ({
        id: i,
        name: currency,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currenciesAsString]);

  return (
    <>
      {showCurrencies ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
                  {capitalizeString("Currencies")}
                </h5>
                {isLoadingCurrencies ? (
                  <Loader size={LoaderSize.SMALL} />
                ) : (
                  <CompleteIcon />
                )}
              </div>
              {showCurrencies ? (
                <button onClick={() => setShowCurrencies(false)}>
                  <CloseIcon />
                </button>
              ) : null}
            </div>
            <h5 className="text-sm leading-tight  opacity-50 md:text-lg">
              {capitalizeString("Can reorder by moving ≡, add, delete")}
            </h5>
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
              e.preventDefault()
            }
          >
            <Select
              className={`my-react-select-container grow`}
              classNamePrefix="my-react-select"
              options={currenicesOptions}
              isSearchable={false}
              onChange={(val) => val?.value && setNewCurrency(val?.value)}
            />

            <button
              className={`${twButton} ${
                isLoadingCurrencies ? "opacity-50" : ""
              }`}
              onClick={saveNewCurrency}
              disabled={isLoadingCurrencies}
            >
              <div className="w-8">
                {" "}
                {!showCurrencyLoader ? (
                  capitalizeString("Save")
                ) : (
                  <Loader size={LoaderSize.SMALL} />
                )}
              </div>
            </button>
          </form>
          <ul className="flex flex-col gap-6">
            {sortableCurrencies ? (
              <ReactSortable
                tag="ul"
                animation={200}
                easing="ease-out"
                delay={2}
                list={sortableCurrencies}
                scrollSpeed={20}
                handle={!isLoadingCurrencies ? ".order-handle" : ""}
                setList={async (updCurrencies) => {
                  if (!getIsCurrenciesOrderChanged(updCurrencies)) {
                    return;
                  }
                  setSortableCurrencies(updCurrencies);
                  setCurrencies({
                    id: userId,
                    currencies: updCurrencies.map(({ name }) => name),
                  });
                  addQueryParamToRefetchDataOnHomePage();
                }}
              >
                {sortableCurrencies.map(({ name, id }, index) => (
                  <li
                    className="-mx-2 flex select-none justify-between gap-2 rounded bg-white px-2 dark:bg-slate-800"
                    key={id}
                  >
                    <div className="flex w-full gap-2 py-3">
                      <div
                        className={`order-handle ${
                          isLoadingCurrencies
                            ? "pointer-events-none opacity-50"
                            : "cursor-move"
                        }`}
                      >
                        <MoveIcon />
                      </div>
                      <span className="opacity-50">{index + 1}.</span>
                      {name}
                    </div>
                    <button
                      disabled={isLoadingCurrencies}
                      className={`${isLoadingCurrencies ? "opacity-50" : ""}`}
                      onClick={() => deleteCurrency(index)}
                    >
                      <DeleteIcon />
                    </button>
                  </li>
                ))}
              </ReactSortable>
            ) : (
              <li>
                <Loader />
              </li>
            )}
          </ul>
        </div>
      ) : null}
      {!showCurrencies ? (
        <button
          className={twButton}
          onClick={() => setShowCurrencies((value) => !value)}
        >
          {!showCurrencies
            ? capitalizeString("Edit currencies")
            : capitalizeString("Hide currencies")}
        </button>
      ) : null}
    </>
  );
};

export const UserCurrencies = memo(Comp);
