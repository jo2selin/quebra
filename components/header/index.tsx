import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "../button";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <>
      <div className=" sticky top-0 bg-jam-dark-purple/80 backdrop-blur">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center   ">
          <div className="logo relative">
            <Link href="/" className="text-4xl text-white">
              Quebra
            </Link>
            <span className="absolute -bottom-1 right-2 bg-jam-pink rounded-md px-2 py-0 text-xs ">
              BETA
            </span>
          </div>

          <div className=" flex-1 flex items-end justify-end ">
            {session?.user && (
              <div className="flex justify-end flex-wrap">
                <Button to={`/me`} className="mr-2 text-sm" style="secondary">
                  My account
                </Button>
                <Button to={"/api/auth/signout"} className="text-sm">
                  Log out
                </Button>
              </div>
            )}

            {!session && (
              <>
                {/* <Button to={`/api/auth/signin`} >Log In</Button> */}
                <a
                  href={`/api/auth/signin`}
                  className={"px-3 py-1 mx-5 bg-cyan-600 text-white rounded"}
                  onClick={(e) => {
                    e.preventDefault();
                    signIn();
                  }}
                >
                  Sign in
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
