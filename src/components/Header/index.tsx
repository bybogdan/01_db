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
          className="h-8 w-8"
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
          className="h-8 w-8"
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
        <span className="relative flex items-center gap-2">
          <svg
            className="h-8 w-8"
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
              d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"
            />
          </svg>
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-lg"
            style={{
              color: `${
                `/user/${userId}` === router.asPath
                  ? HIGHLIGHT_COLOR
                  : "currentColor"
              }`,
              fontWeight: 500,
            }}
          >
            {capitalizeString(userName[0] as string)}
          </span>
        </span>
      </Link>
    </div>
  );
};

export const Header = memo(Comp);
