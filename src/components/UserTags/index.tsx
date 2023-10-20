import { memo, useState } from "react";
import { ReactSortable } from "react-sortablejs";

import { LoaderSize } from "../../types/misc";
import { capitalizeString, showError } from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twButton, twInput } from "../../utils/twCommon";
import { CloseIcon, CompleteIcon, DeleteIcon, MoveIcon } from "../icons";
import { Loader } from "../Loader";

interface IComp {
  tags: string[];
  userId: string;
  refetchGetUser: () => Promise<void>;
  addQueryParamToRefetchDataOnHomePage: () => void;
  isHighlited: boolean;
  setIsHighlited: (value: boolean) => void;
}

export const Comp: React.FC<IComp> = ({
  tags,
  userId,
  refetchGetUser,
  addQueryParamToRefetchDataOnHomePage,
  isHighlited,
  setIsHighlited,
}) => {
  const [showTags, setShowTags] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [showTagLoader, setShowTagLoader] = useState(false);

  const [sortableTags, setSortableTags] = useState(
    tags.map((tag, i) => ({
      id: i,
      name: tag,
    }))
  );

  const { mutate: setTags, isLoading: isLoadingTags } =
    trpc.user.setTags.useMutation({
      onSuccess: async ({ tags }) => {
        if (!tags.length) {
          return;
        }
        await refetchGetUser();
        setNewTag("");
        setSortableTags(
          tags.map((tag, i) => ({
            id: i,
            name: tag,
          }))
        );
        setShowTagLoader(false);
      },
    });

  const saveNewTag = async () => {
    const newTagName = newTag.toUpperCase().trim();
    if (tags.includes(newTagName)) {
      showError(`This tag already exists [${newTagName}]`);
      return;
    }

    setShowTagLoader(true);
    const newTags = [...tags, newTagName];
    setNewTag("");
    setTags({
      id: userId,
      tags: newTags,
    });

    Promise.allSettled([
      fetch(`/api/revalidate?secret=revalidate&route=/user/${userId}`),
      fetch(`/api/revalidate?secret=revalidate&route=/search/${userId}`),
    ]);
    addQueryParamToRefetchDataOnHomePage();
  };

  const deleteTag = async (index: number) => {
    tags.splice(index, 1);
    setSortableTags(
      tags.map((tag, i) => ({
        id: i,
        name: tag,
      }))
    );
    setTags({
      id: userId,
      tags: tags,
    });

    Promise.allSettled([
      fetch(`/api/revalidate?secret=revalidate&route=/user/${userId}`),
      fetch(`/api/revalidate?secret=revalidate&route=/search/${userId}`),
    ]);
    addQueryParamToRefetchDataOnHomePage();
  };

  const getIsCatsOrderChanged = (updCats: typeof sortableTags) => {
    return updCats.some(({ name }, index) => {
      return name !== tags[index];
    });
  };

  const isSortable = sortableTags && sortableTags.length > 1;

  return (
    <>
      {showTags ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
                  {capitalizeString("Tags")}
                </h5>
                {isLoadingTags ? (
                  <Loader size={LoaderSize.SMALL} />
                ) : (
                  <CompleteIcon />
                )}
              </div>
              {showTags ? (
                <button onClick={() => setShowTags(false)}>
                  <CloseIcon />
                </button>
              ) : null}
            </div>
            <h5 className="text-sm leading-tight  opacity-50 md:text-lg">
              {isSortable
                ? capitalizeString("Can reorder by moving ≡, add, delete")
                : ""}
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
              placeholder="Add new tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <button
              className={`${twButton} ${isLoadingTags ? "opacity-50" : ""}`}
              onClick={saveNewTag}
              disabled={isLoadingTags}
            >
              <div className="w-8">
                {" "}
                {!showTagLoader ? (
                  capitalizeString("Save")
                ) : (
                  <Loader size={LoaderSize.SMALL} />
                )}
              </div>
            </button>
          </form>
          <ul className="flex flex-col gap-6">
            {sortableTags ? (
              <ReactSortable
                tag="ul"
                animation={200}
                easing="ease-out"
                delay={2}
                list={sortableTags}
                scrollSpeed={20}
                disabled={!isSortable}
                handle={!isLoadingTags ? ".order-handle" : ""}
                setList={async (updTags) => {
                  if (!getIsCatsOrderChanged(updTags)) {
                    return;
                  }
                  setSortableTags(updTags);
                  setTags({
                    id: userId,
                    tags: updTags.map(({ name }) => name),
                  });
                  addQueryParamToRefetchDataOnHomePage();
                }}
              >
                {sortableTags.map(({ name, id }, index) => (
                  <li
                    className="-mx-2 flex select-none justify-between gap-2 rounded bg-white px-2 dark:bg-slate-800"
                    key={id}
                  >
                    <div className="flex w-full gap-2 py-3">
                      <div
                        className={`order-handle ${
                          isLoadingTags
                            ? "pointer-events-none opacity-50"
                            : "cursor-move"
                        }`}
                      >
                        {isSortable ? <MoveIcon /> : null}
                      </div>
                      <span className="opacity-50">{index + 1}.</span>
                      {name}
                    </div>
                    <button
                      disabled={isLoadingTags}
                      className={`${isLoadingTags ? "opacity-50" : ""}`}
                      onClick={() => deleteTag(index)}
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
      {!showTags ? (
        <button
          className={`${twButton} ${isHighlited ? "bg-blue-400 " : ""}`}
          onClick={() => {
            setShowTags((value) => !value);
            setIsHighlited(false);
          }}
        >
          {!showTags
            ? tags.length < 1
              ? capitalizeString("Add tags")
              : capitalizeString("Edit tags")
            : capitalizeString("Hide tags")}
        </button>
      ) : null}
    </>
  );
};

export const UserTags = memo(Comp);
