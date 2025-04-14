import React from "react";
import { useSession, signOut } from "next-auth/react";

type PropsMeLayout = {
  title: string;
  children: React.ReactNode;
};

export default function MeLayout({
  title = "My account",
  children,
}: PropsMeLayout) {
  return (
    <div className="mx-auto mb-20 md:max-w-4xl ">
      <div className="flex items-center justify-between">
        <h1 className="text-5xl uppercase">{title}</h1>
        <div
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-md inline-block cursor-pointer rounded-md border-b-4 border-jam-light-purple bg-[#323232] px-4 py-2 text-sm uppercase leading-none text-white hover:text-white"
        >
          Se déconnecter
        </div>
      </div>
      {children}
    </div>
  );
}
