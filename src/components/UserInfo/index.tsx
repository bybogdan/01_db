import { signOut, useSession } from "next-auth/react";
import { memo } from "react";
import { useAppContext } from "../../hooks";

const Comp: React.FC = ({}) => {
  const { data: sessionData } = useSession();

  const { totalExpenseByCurrency } = useAppContext();

  if (!sessionData?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span>{sessionData.user.name}</span>
      {/* {sessionData.user.image ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={sessionData.user.image}
        width="50"
        height="50"
        alt="userpic"
      />
    ) : null} */}
      <div>
        <p>Total expense</p>
        {totalExpenseByCurrency &&
        Object.entries(totalExpenseByCurrency).length ? (
          Object.entries(totalExpenseByCurrency).map(
            ([currency, amount], index) => (
              <div key={currency + index}>{`${currency} - ${amount}`}</div>
            )
          )
        ) : (
          <div>0</div>
        )}
      </div>
      <button
        className="rounded-full bg-black/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-black/20"
        onClick={() => signOut()}
      >
        sign out
      </button>
    </div>
  );
};

export const UserInfo = memo(Comp);
