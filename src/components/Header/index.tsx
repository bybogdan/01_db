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

const HIGHLIGHT_COLOR = "rgb(96 165 250)";

const Comp: React.FC<IComp> = ({ homePageHref, userName, userId }) => {
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
          name={capitalizeString(userName[0] as string)}
        />
      </Link>
    </div>
  );
};

export const Header = memo(Comp);
