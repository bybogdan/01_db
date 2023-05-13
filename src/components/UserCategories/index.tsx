import { memo, useState } from "react";
import { ReactSortable } from "react-sortablejs";

import { LoaderSize } from "../../types/misc";
import { capitalizeString } from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twButton, twInput } from "../../utils/twCommon";
import { CloseIcon, CompleteIcon, DeleteIcon } from "../icons";
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

  const { mutate: setCategories, isSuccess: isSuccessfullyCategories } =
    trpc.user.setCategories.useMutation({
      onSuccess: async () => {
        await refetchGetUser();
        setNewCategory("");
        setShowCategoryLoader(false);
      },
    });

  const saveNewCategory = async () => {
    setShowCategoryLoader(true);
    const newCategories = [...categories, newCategory.toUpperCase().trim()];
    setSortableCategories(
      newCategories.map((category, i) => ({
        id: i,
        name: category,
      }))
    );
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

  return (
    <>
      {showCategories ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
                {capitalizeString("Categories")}
              </h5>
              {!isSuccessfullyCategories ? (
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
          <ul className="flex flex-col gap-6">
            {sortableCategories ? (
              <ReactSortable
                tag="ul"
                animation={200}
                easing="ease-out"
                delay={2}
                list={sortableCategories}
                scrollSpeed={20}
                setList={async (updCats) => {
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
                    className="-mx-2 flex justify-between gap-2 rounded px-2 active:bg-slate-100 dark:active:bg-slate-700"
                    key={id}
                  >
                    <p className="w-full	cursor-move py-3 [&>*]:active:opacity-0">
                      <span className="active:opacity-0">{index + 1}.</span>{" "}
                      {name}
                    </p>
                    <button onClick={() => deleteCategory(index)}>
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
            <li>
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
                  className={`${twButton}`}
                  onClick={saveNewCategory}
                  disabled={!newCategory.trim().length}
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
            </li>
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
