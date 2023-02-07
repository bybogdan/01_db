import { memo, useEffect, useState } from "react";
import { LoaderSize } from "../../types/misc";
import { capitalizeString } from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twButton, twInput } from "../../utils/twCommon";
import { DeleteIcon } from "../icons";
import { Loader } from "../Loader";

interface IComp {
  categories: string[];
  userId: string;
  refetchGetUser: () => Promise<void>;
}

export const Comp: React.FC<IComp> = ({
  categories,
  userId,
  refetchGetUser,
}) => {
  const [showCategories, setShowCategories] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryLoader, setShowCategoryLoader] = useState(false);

  const { mutate: setCategories, isSuccess: setCategoriesIsSuccess } =
    trpc.user.setCategories.useMutation();

  const saveNewCategory = async () => {
    setShowCategoryLoader(true);
    setCategories({
      id: userId,
      categories: [...categories, newCategory.toUpperCase().trim()],
    });
  };

  const deleteCategory = async (index: number) => {
    categories.splice(index, 1);
    setCategories({
      id: userId,
      categories: categories,
    });
  };

  useEffect(() => {
    (async () => {
      if (setCategoriesIsSuccess) {
        await refetchGetUser();
        setNewCategory("");
        setShowCategoryLoader(false);
      }
    })();
  }, [setCategoriesIsSuccess, refetchGetUser]);

  return (
    <>
      {showCategories ? (
        <div className="flex flex-col gap-4">
          <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
            {capitalizeString("Categories")}
          </h5>
          <ul className="flex flex-col-reverse gap-6">
            {categories ? (
              categories.map((category, index) => (
                <li
                  className="flex justify-between gap-2"
                  key={`category-${index}`}
                >
                  <p>{category as string}</p>
                  <button onClick={() => deleteCategory(index)}>
                    <DeleteIcon />
                  </button>
                </li>
              ))
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
                  className={twButton}
                  onClick={saveNewCategory}
                  disabled={!newCategory.trim().length}
                >
                  {!showCategoryLoader ? (
                    capitalizeString("Save")
                  ) : (
                    <Loader size={LoaderSize.SMALL} />
                  )}
                </button>
              </form>
            </li>
          </ul>
        </div>
      ) : null}
      {
        <button
          className={twButton}
          onClick={() => setShowCategories((value) => !value)}
        >
          {!showCategories
            ? capitalizeString("categories")
            : capitalizeString("Hide categories")}
        </button>
      }
    </>
  );
};

export const UserCategories = memo(Comp);
