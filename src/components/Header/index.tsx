import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";
import { capitalizeString } from "../../utils/common";
import { HomeIcon, StatsIcon, UserIcon } from "../icons";

interface IComp {
  homePageHref?: string;
  userName?: string;
  userId?: string;
  isHide?: boolean;
}

const HIGHLIGHT_COLOR = "rgb(59, 130, 246)";

const Comp: React.FC<IComp> = ({
  homePageHref = "/",
  userName,
  userId,
  isHide = false,
}) => {
  const name = capitalizeString(userName ? (userName[0] as string) : "");
  const router = useRouter();

  const isDisabled = !userName || !userId;

  return (
    <div
      className={`flex items-center justify-between ${
        isHide ? "opacity-0" : ""
      }`}
    >
      <Link className="h-fit" href={!isDisabled ? homePageHref : ""}>
        <HomeIcon
          color={
            homePageHref === router.asPath ? HIGHLIGHT_COLOR : "currentColor"
          }
        />
      </Link>

      <Link className="h-fit" href={!isDisabled ? `/stats/${userId}` : ""}>
        <StatsIcon
          color={
            `/stats/${userId}` === router.asPath
              ? HIGHLIGHT_COLOR
              : "currentColor"
          }
        />
      </Link>

      <Link href={!isDisabled ? `/user/${userId}` : ""}>
        <UserIcon
          color={
            `/user/${userId}` === router.asPath
              ? HIGHLIGHT_COLOR
              : "currentColor"
          }
          name={!isDisabled ? name : ""}
        />
      </Link>
    </div>
  );
};

export const Header = memo(Comp);
