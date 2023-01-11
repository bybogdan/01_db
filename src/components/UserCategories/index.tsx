import { memo, useEffect, useState } from "react";
import { LoaderSize } from "../../types/misc";
import { capitalizeString } from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twButton, twInput } from "../../utils/twCommon";
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
      <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
        {capitalizeString("Categories")}
      </h5>
      <ul className="flex flex-col gap-6">
        {categories ? (
          categories.map((category, index) => (
            <li
              className="flex justify-between gap-2"
              key={`category-${index}`}
            >
              <p>{category as string}</p>
              <button onClick={() => deleteCategory(index)}>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                  />
                </svg>
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
              placeholder="New category"
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
    </>
  );
};

export const UserCategories = memo(Comp);
