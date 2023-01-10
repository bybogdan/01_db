import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";
import { capitalizeString } from "../../utils/common";

interface IComp {
  homePageHref: string;
  userName: string;
  userId: string;
}

const HIGHLIGHT_COLOR = "#f59f00";

const Comp: React.FC<IComp> = ({ homePageHref, userName, userId }) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <Link className="h-fit" href={homePageHref}>
        <svg
          aria-hidden="true"
          focusable="false"
          className="h-7 w-7"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          <path
            fill={
              homePageHref === router.asPath ? HIGHLIGHT_COLOR : "currentColor"
            }
            d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
          />
        </svg>
      </Link>

      <Link className="h-fit" href={`/stats/${userId}`}>
        <svg
          aria-hidden="true"
          focusable="false"
          className="h-7 w-7"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill={
              `/stats/${userId}` === router.asPath
                ? HIGHLIGHT_COLOR
                : "currentColor"
            }
            d="M160 80c0-26.5 21.5-48 48-48h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V80zM0 272c0-26.5 21.5-48 48-48H80c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V272zM368 96h32c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48H368c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48z"
          />
        </svg>
      </Link>

      <Link href={`/user/${userId}`}>
        <span className="flex flex-row-reverse items-center gap-2">
          <svg
            className="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            aria-hidden="true"
            focusable="false"
            role="img"
          >
            <path
              fill={
                `/user/${userId}` === router.asPath
                  ? HIGHLIGHT_COLOR
                  : "currentColor"
              }
              d="M256 112c-48.6 0-88 39.4-88 88C168 248.6 207.4 288 256 288s88-39.4 88-88C344 151.4 304.6 112 256 112zM256 240c-22.06 0-40-17.95-40-40C216 177.9 233.9 160 256 160s40 17.94 40 40C296 222.1 278.1 240 256 240zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-46.73 0-89.76-15.68-124.5-41.79C148.8 389 182.4 368 220.2 368h71.69c37.75 0 71.31 21.01 88.68 54.21C345.8 448.3 302.7 464 256 464zM416.2 388.5C389.2 346.3 343.2 320 291.8 320H220.2c-51.36 0-97.35 26.25-124.4 68.48C65.96 352.5 48 306.3 48 256c0-114.7 93.31-208 208-208s208 93.31 208 208C464 306.3 446 352.5 416.2 388.5z"
            />
          </svg>
          {/* {capitalizeString(userName)} */}
        </span>
      </Link>
    </div>
  );
};

export const Header = memo(Comp);
