import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "../button";
import { useState } from "react";

const Nav = ({ setMenuOpen, menuIsOpen, session }: any) => {
  return (
    <nav>
      <ol
        className={`flex w-full flex-col justify-center items-center md:flex-row ${
          !menuIsOpen ? "h-0" : ""
        }`}
      >
        <li
          className="mb-3 md:ml-8 md:mb-0 "
          onClick={() => setMenuOpen(false)}
        >
          <Link href={"/projects"} className="text-white text-2xl">
            Projects
          </Link>
        </li>
        <li className="mb-3 md:ml-8 md:mb-0" onClick={() => setMenuOpen(false)}>
          <Link href={"/news"} className="text-white text-2xl">
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
          <li className="mb-1 md:ml-8 md:mb-0">
            <Button to={`/api/auth/signin`}>Se Connecter</Button>
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
      <div className=" sticky top-0 bg-jam-dark-purple/80 backdrop-blur z-30">
        <div className="bg-gradient-to-r from-jam-purple to-jam-pink text-white font-mono normal-case border-b-2 border-jam-purple">
          <div className="container mx-auto py-2 px-3">
            Pré-inscriptions ouvertes! <br />
            Faites partie des premiers à{" "}
            <span className="font-bold"> publier votre projet musical</span> sur
            Quebra (tracks/mixtapes...) 💿🔥🔥
            <br />
            <Link href="/auth/signin" className="text-white font-bold">
              Inscrivez-vous dès maintenant. ⬅️
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 py-5 flex justify-between items-center   ">
          <div className="logo relative" onClick={() => setmenuIsOpen(false)}>
            <Link href="/" className="text-4xl text-white">
              Quebra
            </Link>
            <span className="absolute -bottom-1 right-2 bg-jam-pink rounded-md px-2 py-0 text-xs ">
              BETA
            </span>
          </div>

          {/* desktop */}
          <div className="hidden md:flex md:flex-1 items-end justify-end">
            <Nav setMenuOpen={setmenuIsOpen} session={session} />
          </div>

          <div className="md:hidden flex-1 flex items-end justify-end ">
            <div className="flex flex-row ">
              <div
                className="space-y-2 cursor-pointer "
                onClick={() => setmenuIsOpen(!menuIsOpen)}
              >
                <div
                  className={`w-8 h-1 bg-gray-200 transition-all ${
                    menuIsOpen ? "rotate-45 translate-y-3" : ""
                  } `}
                ></div>
                <div
                  className={`w-8 h-1 bg-gray-200 transition-all ${
                    menuIsOpen ? "opacity-0" : ""
                  } `}
                ></div>
                <div
                  className={`w-8 h-1 bg-gray-200 transition-all ${
                    menuIsOpen ? "-rotate-45 -translate-y-3" : ""
                  } `}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* mobile */}
        <div
          className={` md:hidden transition-all  ${
            menuIsOpen
              ? "w-full translate-y-5 opacity-100 py-10 px-10 -mt-5"
              : " h-0 -translate-y-72 opacity-0 p-0 m-0"
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
