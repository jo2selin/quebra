import Link from "next/link";
import { UrlObject } from "url";
declare type Url = string | UrlObject;

interface Props {
  to: Url;
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
  return (
    <div className={className}>
      <Link
        href={to}
        className={`inline-block text-md text-white  rounded-md px-4 py-2 leading-none hover:text-white ${
          style === "primary" && "bg-jam-purple border-b-4 border-jam-pink"
        } ${
          style === "secondary" && "bg-jam-pink border-b-4 border-jam-purple"
        }  `}
      >
        {children}
      </Link>
    </div>
  );
}
