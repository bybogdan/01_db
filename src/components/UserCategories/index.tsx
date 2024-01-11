import { memo, useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";

import { LoaderSize } from "../../types/misc";
import { capitalizeString, showError } from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twButton, twInput } from "../../utils/twCommon";
import { CloseIcon, CompleteIcon, DeleteIcon, MoveIcon } from "../icons";
import { Loader } from "../Loader";
import * as Switch from "@radix-ui/react-switch";

interface IComp {
  categories: string[];
  homePageCategory: string;
  userId: string;
  refetchGetUser: () => Promise<void>;
  addQueryParamToRefetchDataOnHomePage: () => void;
}

export const Comp: React.FC<IComp> = ({
  categories,
  homePageCategory,
  userId,
  refetchGetUser,
  addQueryParamToRefetchDataOnHomePage,
}) => {
  const [showCategories, setShowCategories] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryLoader, setShowCategoryLoader] = useState(false);
  const [
    selectedCategoryToShowOnHomePage,
    setSelectedCategoryToShowOnHomePage,
  ] = useState(-1);

  const [sortableCategories, setSortableCategories] = useState(
    categories.map((category, i) => ({
      id: i,
      name: category,
    }))
  );

  const { mutate: setCategories, isLoading: isLoadingCategories } =
    trpc.user.setCategories.useMutation({
      onSuccess: async ({ categories }) => {
        if (!categories.length) {
          return;
        }
        await refetchGetUser();
        setNewCategory("");
        setSortableCategories(
          categories.map((category, i) => ({
            id: i,
            name: category,
          }))
        );
        setShowCategoryLoader(false);
      },
    });

  const { mutate: setHomePageCategory, isLoading: isLoadingHomePageCategory } =
    trpc.user.setHomePageCategory.useMutation({
      onSuccess: async () => {
        await refetchGetUser();
      },
    });

  const handleSelectCategoryToShowOnHomePage = (
    chekbox: boolean,
    index: number
  ) => {
    setHomePageCategory({
      id: userId,
      homePageCategory: chekbox ? categories[index] || "" : "",
    });
    setSelectedCategoryToShowOnHomePage(chekbox ? index : -1);
    addQueryParamToRefetchDataOnHomePage();
  };

  const saveNewCategory = async () => {
    const newCategoryName = newCategory.toUpperCase().trim();
    if (categories.includes(newCategoryName)) {
      showError(`This category already exists [${newCategoryName}]`);
      return;
    }

    setShowCategoryLoader(true);
    const newCategories = [...categories, newCategoryName];
    setNewCategory("");
    setCategories({
      id: userId,
      categories: newCategories,
    });

    await Promise.allSettled([
      fetch(`/api/revalidate?secret=revalidate&route=/user/${userId}`),
      fetch(`/api/revalidate?secret=revalidate&route=/search/${userId}`),
    ]);
    addQueryParamToRefetchDataOnHomePage();
  };

  const deleteCategory = async (index: number) => {
    categories.splice(index, 1);
    setSortableCategories(
      categories.map((category, i) => ({
        id: i,
        name: category,
      }))
    );
    setCategories({
      id: userId,
      categories: categories,
    });

    await Promise.allSettled([
      fetch(`/api/revalidate?secret=revalidate&route=/user/${userId}`),
      fetch(`/api/revalidate?secret=revalidate&route=/search/${userId}`),
    ]);
    addQueryParamToRefetchDataOnHomePage();
  };

  const getIsCatsOrderChanged = (updCats: typeof sortableCategories) => {
    return updCats.some(({ name }, index) => {
      return name !== categories[index];
    });
  };

  const categoriesAsString = JSON.stringify(categories);

  useEffect(() => {
    setSortableCategories(
      categories.map((tag, i) => ({
        id: i,
        name: tag,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesAsString]);

  const isLoading = isLoadingCategories || isLoadingHomePageCategory;

  return (
    <>
      {showCategories ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
                  {capitalizeString("Categories")}
                </h5>
                {isLoading ? (
                  <Loader size={LoaderSize.SMALL} />
                ) : (
                  <CompleteIcon />
                )}
              </div>
              {showCategories ? (
                <button onClick={() => setShowCategories(false)}>
                  <CloseIcon />
                </button>
              ) : null}
            </div>
            <h5 className="text-sm leading-tight opacity-50 md:text-lg">
              {capitalizeString("Can reorder by moving ≡, add, delete")}
            </h5>
            <h5 className="text-sm leading-tight opacity-50 md:text-lg">
              {capitalizeString(
                "Select checkbox at category to show it balance on home page"
              )}
            </h5>
            <h5 className="text-sm leading-tight md:text-lg">
              Now on home page shown:{" "}
              <span className="font-bold">
                {categories[selectedCategoryToShowOnHomePage]}
              </span>
            </h5>
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
              e.preventDefault()
            }
          >
            <input
              type="text"
              autoComplete="off"
              className={`${twInput}`}
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              className={`${twButton} ${isLoading ? "opacity-50" : ""}`}
              onClick={saveNewCategory}
              disabled={isLoading}
            >
              <div className="w-8">
                {" "}
                {!showCategoryLoader ? (
                  capitalizeString("Save")
                ) : (
                  <Loader size={LoaderSize.SMALL} />
                )}
              </div>
            </button>
          </form>
          <ul className="flex flex-col gap-6">
            {sortableCategories ? (
              <ReactSortable
                tag="ul"
                animation={200}
                easing="ease-out"
                delay={2}
                list={sortableCategories}
                scrollSpeed={20}
                handle={!isLoading ? ".order-handle" : ""}
                setList={async (updCats) => {
                  if (!getIsCatsOrderChanged(updCats)) {
                    return;
                  }
                  setSortableCategories(updCats);
                  setCategories({
                    id: userId,
                    categories: updCats.map(({ name }) => name),
                  });
                  addQueryParamToRefetchDataOnHomePage();
                }}
              >
                {sortableCategories.map(({ name, id }, index) => (
                  <li
                    className="-mx-2 flex select-none justify-between gap-2 rounded bg-white px-2 dark:bg-slate-800"
                    key={id}
                  >
                    <div className="flex w-full gap-2 py-3">
                      <div
                        className={`order-handle ${
                          isLoading
                            ? "pointer-events-none opacity-50"
                            : "cursor-move"
                        }`}
                      >
                        <MoveIcon />
                      </div>
                      <span className="opacity-50">{index + 1}.</span>
                      {name}
                    </div>
                    <div className="flex items-center gap-8">
                      <Switch.Root
                        className="relative h-[30px] w-[46px] cursor-pointer rounded-full border-2 border-solid border-blue-600 outline-none disabled:opacity-50 data-[state=checked]:bg-blue-600"
                        id="balance-type-switch"
                        onCheckedChange={(chekbox) =>
                          handleSelectCategoryToShowOnHomePage(chekbox, index)
                        }
                        checked={
                          index === selectedCategoryToShowOnHomePage ||
                          (homePageCategory === name &&
                            selectedCategoryToShowOnHomePage === -1)
                        }
                        disabled={isLoading}
                      >
                        <Switch.Thumb className="shadow-blackA4 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
                      </Switch.Root>
                      <button
                        disabled={isLoading}
                        className={`${isLoading ? "opacity-50" : ""}`}
                        onClick={() => deleteCategory(index)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
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
      {!showCategories ? (
        <button
          className={twButton}
          onClick={() => setShowCategories((value) => !value)}
        >
          {!showCategories
            ? capitalizeString("Edit categories")
            : capitalizeString("Hide categories")}
        </button>
      ) : null}
    </>
  );
};

export const UserCategories = memo(Comp);
