import Link from "next/link";
import { BackIcon } from "./icons";
import { twButton } from "../utils/twCommon";

export const LinkToHome = () => (
  <button className={`${twButton} mt-10 w-full`}>
    <Link href={`/`} className="flex w-full items-center justify-center gap-2">
      <BackIcon /> Go to home
    </Link>
  </button>
);
