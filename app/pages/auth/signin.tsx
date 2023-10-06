import React, { useState } from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getCsrfToken } from "next-auth/react";

import Image from "next/image";
import IconGoogle from "../../public/iconGoogle.svg";
import IconDiscord from "../../public/iconDiscord.svg";

const EmailForm = ({ csrfToken, text }: any) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  return (
    <div
      className={` mt-4 max-w-md ${
        showEmailForm && " rounded-lg bg-jam-dark-grey"
      }`}
    >
      <button
        onClick={() => setShowEmailForm(!showEmailForm)}
        className="  m-auto  flex rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-800 shadow-md hover:bg-gray-200 "
      >
        <span className="font-sans">
          {text} via Email <small>(magic link)</small>
        </span>
      </button>
      {showEmailForm && (
        <>
          <p className="mt-2 px-4 py-2 font-mono text-xs normal-case">
            Nous vous enverrons un email avec un lien de connection.
          </p>
          <form
            method="post"
            action="/api/auth/signin/email"
            className="mt-2 flex w-full flex-col px-4 font-sans normal-case"
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <input
              type="email"
              id="email"
              name="email"
              className="text-md rounded-t-lg px-4 py-3 text-black"
              placeholder="Votre email"
            />
            <button
              type="submit"
              className="mb-4 rounded-b-lg bg-jam-purple px-6 py-2 text-sm font-medium"
            >
              M'envoyer le lien
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default function SignIn({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex flex-col items-center justify-center md:flex-row-reverse">
      <div className="mb-12 md:ml-16">
        <h2 className="mx-auto hidden w-full -translate-y-4 text-center text-4xl md:block">
          Connection
        </h2>
        <div className="mb-4 flex flex-wrap gap-x-8">
          {Object.values(providers)
            .filter((p) => p.name !== "Email")
            .map((provider) => (
              <div key={provider.name} className="md:w-full">
                <button
                  onClick={() => signIn(provider.id)}
                  className="mt-4 flex items-center rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-800 shadow-md outline-none hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 md:w-full "
                >
                  {provider.name === "Google" && (
                    <Image
                      src={IconGoogle.src}
                      width="16"
                      height="16"
                      alt=""
                      className="mr-2"
                    />
                  )}
                  {provider.name === "Discord" && (
                    <Image
                      src={IconDiscord.src}
                      width="16"
                      height="16"
                      alt=""
                      className="mr-2"
                    />
                  )}
                  <span className="font-sans">Se connecter</span>
                </button>
              </div>
            ))}
        </div>
        <EmailForm csrfToken={csrfToken} text={"Se connecter"} />
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md rounded-xl border-2 border-jam-purple pb-4">
          <h1 className="mx-auto w-full -translate-y-4 text-center text-4xl">
            Inscription
          </h1>
          <ul>
            <li className="px-4 pb-5 text-xl">
              ✅ Creez un projet et Uploadez vos pistes audio
            </li>
            <li className="px-4 pb-5 text-xl">
              ✅ Visibilité, téléchargement direct et partage facile
            </li>
            <li className="px-4 pb-5 text-xl">✅ fAITES VOUS REMARQUER</li>
            <li className="px-4 pb-5 text-xl">
              ✅ Accès depuis n&apos;importe où
            </li>
            <li className="px-4 pl-12 pb-5 text-xl opacity-40">
              Liez vos pages Spotify, Deezer{" "}
              <span className="font-mono text-xs lowercase">Prochainement</span>
            </li>
          </ul>
        </div>
        <div className="h-0 w-full -translate-y-4 text-center ">
          <span className="rounded-xl border-2 border-green-500 bg-jam-dark-purple px-3 py-2 text-white ">
            Gratuit
          </span>
        </div>
        <div className="flex w-full max-w-xs flex-col items-center justify-center rounded-xl rounded-t-none border-2 border-t-0 border-jam-purple p-4 pb-8">
          {Object.values(providers)
            .filter((p) => p.name !== "Email")
            .map((provider) => (
              <div key={provider.name}>
                {/* <button
            className={`inline-block text-2xl text-white  rounded-md px-4 py-2 mb-4 leading-none hover:text-white bg-jam-purple border-b-4 border-jam-pink`}
            >
            Se connecter avec {provider.name}
          </button> */}
                <button
                  onClick={() => signIn(provider.id)}
                  className="mt-4 flex items-center rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-800 shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {provider.name === "Google" && (
                    <Image
                      src={IconGoogle.src}
                      width="16"
                      height="16"
                      alt=""
                      className="mr-2"
                    />
                  )}
                  {provider.name === "Discord" && (
                    <Image
                      src={IconDiscord.src}
                      width="16"
                      height="16"
                      alt=""
                      className="mr-2"
                    />
                  )}
                  <span className="font-sans">
                    S'inscrire avec {provider.name}
                  </span>
                </button>
              </div>
            ))}
          <EmailForm csrfToken={csrfToken} text={"S'inscrire"} />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  const csrfToken = await getCsrfToken(context);

  return {
    props: { providers: providers ?? [], csrfToken },
  };
}
