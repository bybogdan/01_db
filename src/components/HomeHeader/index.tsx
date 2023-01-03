import { signOut } from "next-auth/react";
import Link from "next/link";
import { memo } from "react";
import type { HeaderStatsType } from "../../types/misc";
import {
  BASE_CURRENCY,
  capitalizeString,
  getCurrencySymbol,
  numToFloat,
} from "../../utils/common";
import { twButton } from "../../utils/twCommon";
import { UserIcon } from "../UserIcon";

interface IComp {
  stats: HeaderStatsType;
  sessionUserName: string;
  sessionUserId: string;
}

const Comp: React.FC<IComp> = ({ stats, sessionUserName, sessionUserId }) => {
  return (
    <div className="flex flex-col  gap-2  p-6 ">
      <div className="flex items-center justify-between gap-2">
        <UserIcon userName={sessionUserName} isPositionLeft />
        <div>
          <button className="h-fit" onClick={() => signOut()}>
            <svg
              className="h-7 w-7"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              aria-hidden="true"
              focusable="false"
              role="img"
            >
              <path
                fill="currentColor"
                d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128V384c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32h64zM504.5 273.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22v72H192c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32H320v72c0 9.6 5.7 18.2 14.5 22s19 2 26-4.6l144-136z"
              />
            </svg>
          </button>
        </div>
      </div>
      {stats &&
        Object.entries(stats).map(([key, value], index) => (
          <div key={`${key}-${index}`}>{`${capitalizeString(key)}: ${numToFloat(
            +value
          )} ${getCurrencySymbol(BASE_CURRENCY)}`}</div>
        ))}
      <div>
        <Link className={twButton} href={`/stats/${sessionUserId}`}>
          To stats
        </Link>
      </div>
    </div>
  );
};

export const HomeHeader = memo(Comp);
