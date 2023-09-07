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
  ...props
}: Props) {
  const stylePrimary = "bg-jam-purple border-b-4 border-jam-pink";
  const styleSecondary = "bg-jam-pink border-b-4 border-jam-purple";
  const styleDark = "bg-[#323232] border-b-4 border-jam-light-purple";
  if (to) {
    return (
      <div className={className}>
        <Link
          href={to}
          className={`text-md inline-block rounded-md  px-4 py-2 leading-none text-white hover:text-white ${
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
        <button
          className={`text-md inline-block cursor-pointer rounded-md px-4 py-2 uppercase leading-none text-white hover:text-white ${
            style === "primary" && stylePrimary
          } ${style === "secondary" && styleSecondary}  ${
            style === "dark" && styleDark
          }`}
          {...props}
        >
          {children}
        </button>
      </div>
    );
  }
}
