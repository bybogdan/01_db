import { signOut, useSession } from "next-auth/react";
import { memo } from "react";
import { UseTrpcContext } from "../../hooks";
import { getCurrencySymbol, numToFloat } from "../../utils/common";
import { twButton } from "../../utils/twCommon";

const Comp: React.FC = ({}) => {
  const { data: sessionData } = useSession();

  const { data } = UseTrpcContext();

  const { expense = [] } = data || {};
  const [value, currency] = expense;

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
        {value && currency ? (
          <div>{`Expense: ${numToFloat(+value)} ${getCurrencySymbol(
            currency
          )}`}</div>
        ) : (
          <div>0.00</div>
        )}
      </div>
      <button className={`${twButton}`} onClick={() => signOut()}>
        sign out
      </button>
    </div>
  );
};

export const UserInfo = memo(Comp);
