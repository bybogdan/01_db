import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";
import { capitalizeString } from "../../utils/common";
import { HomeIcon, StatsIcon, UserIcon } from "../icons";

interface IComp {
  homePageHref: string;
  userName: string;
  userId: string;
}

let HIGHLIGHT_COLOR = "rgb(37 99 235";
if (
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  HIGHLIGHT_COLOR = "rgb(96 165 250)";
}

const Comp: React.FC<IComp> = ({ homePageHref, userName, userId }) => {
  const name = capitalizeString(userName ? (userName[0] as string) : "");
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <Link className="h-fit" href={homePageHref}>
        <HomeIcon
          color={
            homePageHref === router.asPath ? HIGHLIGHT_COLOR : "currentColor"
          }
        />
      </Link>

      <Link className="h-fit" href={`/stats/${userId}`}>
        <StatsIcon
          color={
            `/stats/${userId}` === router.asPath
              ? HIGHLIGHT_COLOR
              : "currentColor"
          }
        />
      </Link>

      <Link href={`/user/${userId}`}>
        <UserIcon
          color={
            `/user/${userId}` === router.asPath
              ? HIGHLIGHT_COLOR
              : "currentColor"
          }
          name={name}
        />
      </Link>
    </div>
  );
};

export const Header = memo(Comp);
