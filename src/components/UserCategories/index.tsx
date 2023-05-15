import { memo, useState } from "react";
import { ReactSortable } from "react-sortablejs";

import { LoaderSize } from "../../types/misc";
import { capitalizeString, showError } from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twButton, twInput } from "../../utils/twCommon";
import { CloseIcon, CompleteIcon, DeleteIcon, MoveIcon } from "../icons";
import { Loader } from "../Loader";

interface IComp {
  categories: string[];
  userId: string;
  refetchGetUser: () => Promise<void>;
  addQueryParamToRefetchDataOnHomePage: () => void;
}

export const Comp: React.FC<IComp> = ({
  categories,
  userId,
  refetchGetUser,
  addQueryParamToRefetchDataOnHomePage,
}) => {
  const [showCategories, setShowCategories] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryLoader, setShowCategoryLoader] = useState(false);

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
    addQueryParamToRefetchDataOnHomePage();
  };

  const getIsCatsOrderChanged = (updCats: typeof sortableCategories) => {
    return updCats.some(({ name }, index) => {
      return name !== categories[index];
    });
  };

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
                {isLoadingCategories ? (
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
            <input
              type="text"
              autoComplete="off"
              className={`${twInput}`}
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              className={`${twButton} ${
                isLoadingCategories ? "opacity-50" : ""
              }`}
              onClick={saveNewCategory}
              disabled={isLoadingCategories}
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
                handle={!isLoadingCategories ? ".order-handle" : ""}
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
                          isLoadingCategories
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
                      disabled={isLoadingCategories}
                      className={`${isLoadingCategories ? "opacity-50" : ""}`}
                      onClick={() => deleteCategory(index)}
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
