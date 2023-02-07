import Link from "next/link";
import { UrlObject } from "url";
declare type Url = string | UrlObject;

interface Props {
  to?: Url;
  className?: string;
  children: React.ReactNode;
  style?: string;
}

export default function Button({
  to,
  className,
  children,
  style = "primary",
}: Props) {
  const stylePrimary = "bg-jam-purple border-b-4 border-jam-pink";
  const styleSecondary = "bg-jam-pink border-b-4 border-jam-purple";
  const styleDark = "bg-[#323232] border-b-4 border-jam-light-purple";
  if (to) {
    return (
      <div className={className}>
        <Link
          href={to}
          className={`inline-block text-md text-white  rounded-md px-4 py-2 leading-none hover:text-white ${
            style === "primary" && stylePrimary
          } ${style === "secondary" && styleSecondary}  ${
            style === "dark" && styleDark
          }`}
        >
          {children}
        </Link>
      </div>
    );
  } else {
    return (
      <div className={className}>
        <div
          className={`inline-block text-md text-white  rounded-md px-4 py-2 leading-none hover:text-white ${
            style === "primary" && stylePrimary
          } ${style === "secondary" && styleSecondary}  ${
            style === "dark" && styleDark
          }`}
        >
          {children}
        </div>
      </div>
    );
  }
}
