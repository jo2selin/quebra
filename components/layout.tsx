import Head from "next/head";
import Link from "next/link";
import Header from "./header";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <div className=" bg-jam-dark-purple">
        <Header />

        <main className="container px-4 mt-12 mx-auto max-w-2xl">
          {children}
        </main>
      </div>
    </>
  );
}
