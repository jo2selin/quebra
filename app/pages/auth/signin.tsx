import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import Image from "next/image";
import IconGoogle from "../../public/iconGoogle.svg";
import IconDiscord from "../../public/iconDiscord.svg";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(IconGoogle);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-12 flex flex-wrap gap-x-8">
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              onClick={() => signIn(provider.id)}
              className=" mt-4 flex items-center rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-800 shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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

      <div className="w-full max-w-md rounded-xl border-2 border-jam-purple pb-4">
        <h1 className="mx-auto w-full -translate-y-4 text-center text-4xl">
          &quot;Premier venu&quot;
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
            Liez vos réseaux sociaux{" "}
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
        {Object.values(providers).map((provider) => (
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
              <span className="font-sans">S'inscrire avec {provider.name}</span>
            </button>
          </div>
        ))}
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

  return {
    props: { providers: providers ?? [] },
  };
}
