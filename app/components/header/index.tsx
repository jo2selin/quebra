import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "../button";
import { useState } from "react";

const Nav = ({ setMenuOpen, menuIsOpen, session }: any) => {
  return (
    <nav>
      <ol
        className={`flex w-full flex-col items-center justify-center md:flex-row ${
          !menuIsOpen ? "h-0" : ""
        }`}
      >
        <li
          className="mb-3 md:ml-8 md:mb-0 "
          onClick={() => setMenuOpen(false)}
        >
          <Link href={"/projects"} className="text-2xl text-white">
            Projects
          </Link>
        </li>
        <li className="mb-3 md:ml-8 md:mb-0" onClick={() => setMenuOpen(false)}>
          <Link href={"/news"} className="text-2xl text-white">
            News
          </Link>
        </li>
        {session?.user && (
          <li
            className="mb-1 md:ml-8 md:mb-0"
            onClick={() => setMenuOpen(false)}
          >
            <Button to={`/me`} className=" text-sm" style="secondary">
              Mon compte
            </Button>
          </li>
        )}
        {!session && (
          <li className=" flex items-baseline">
            <div className="mb-1 md:ml-8 md:mb-0">
              <Button to={`/api/auth/signin`}>S'inscrire</Button>
            </div>
            <div className="ml-4  ">
              <Link href={`/api/auth/signin`} className="text-white">
                Se connecter
              </Link>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default function Header() {
  const { data: session, status } = useSession();
  const [menuIsOpen, setmenuIsOpen] = useState(false);

  return (
    <>
      <div className=" sticky top-0 z-30 bg-jam-dark-purple/80 backdrop-blur">
        <div className="border-b-2 border-jam-purple bg-gradient-to-r from-jam-purple to-[#a621a2] font-mono normal-case text-white">
          <div className="container mx-auto py-2 px-3">
            Faites partie des premiers à{" "}
            <span className="font-bold"> publier votre projet musical</span> sur
            Quebra (tracks/mixtapes...) 💿🔥
            <br />
            <Link href="/auth/signin" className="font-bold text-white">
              Inscrivez-vous dès maintenant. ⬅️
            </Link>
          </div>
        </div>
        <div className="container mx-auto flex items-center justify-between px-4 py-5   ">
          <div className="logo relative" onClick={() => setmenuIsOpen(false)}>
            <Link href="/" className="text-4xl text-white">
              Quebra
            </Link>
            <span className="absolute -bottom-1 right-2 rounded-md bg-jam-pink px-2 py-0 text-xs ">
              BETA
            </span>
          </div>

          {/* desktop */}
          <div className="hidden items-end justify-end md:flex md:flex-1">
            <Nav setMenuOpen={setmenuIsOpen} session={session} />
          </div>

          <div className="flex flex-1 items-end justify-end md:hidden ">
            <div className="flex flex-row ">
              <div
                className="cursor-pointer space-y-2 "
                onClick={() => setmenuIsOpen(!menuIsOpen)}
              >
                <div
                  className={`h-1 w-8 bg-gray-200 transition-all ${
                    menuIsOpen ? "translate-y-3 rotate-45" : ""
                  } `}
                ></div>
                <div
                  className={`h-1 w-8 bg-gray-200 transition-all ${
                    menuIsOpen ? "opacity-0" : ""
                  } `}
                ></div>
                <div
                  className={`h-1 w-8 bg-gray-200 transition-all ${
                    menuIsOpen ? "-translate-y-3 -rotate-45" : ""
                  } `}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* mobile */}
        <div
          className={` transition-all md:hidden  ${
            menuIsOpen
              ? "-mt-5 w-full translate-y-5 py-10 px-10 opacity-100"
              : " m-0 h-0 -translate-y-72 p-0 opacity-0"
          }`}
        >
          <Nav
            setMenuOpen={setmenuIsOpen}
            menuIsOpen={menuIsOpen}
            session={session}
          />
        </div>
      </div>
    </>
  );
}
