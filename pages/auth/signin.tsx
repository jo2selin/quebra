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
    <div className="flex justify-center items-center flex-col">
      <div className="w-full max-w-md border-2 border-jam-purple rounded-xl pb-4">
        <h1 className="text-4xl mx-auto -translate-y-4 w-full text-center">
          &quot;Premier venu&quot;
        </h1>
        <ul>
          <li className="text-xl pb-5 px-4">
            ✅ Creez un projet et Uploadez vos pistes audio
          </li>
          <li className="text-xl pb-5 px-4">✅ Visibilité et partage facile</li>
          <li className="text-xl pb-5 px-4">✅ fAITES VOUS REMARQUER</li>
          <li className="text-xl pb-5 px-4">
            ✅ Accès depuis n&apos;importe où
          </li>
        </ul>
      </div>
      <div className="w-full text-center -translate-y-4 h-0 ">
        <span className="rounded-xl border-2 bg-jam-dark-purple border-green-500 text-white px-3 py-2 ">
          Gratuit
        </span>
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-xs border-2 border-t-0 border-jam-purple rounded-xl rounded-t-none p-4 pb-8">
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            {/* <button
            className={`inline-block text-2xl text-white  rounded-md px-4 py-2 mb-4 leading-none hover:text-white bg-jam-purple border-b-4 border-jam-pink`}
          >
            Se connecter avec {provider.name}
          </button> */}
            <button
              onClick={() => signIn(provider.id)}
              className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 mt-4 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
                Se connecter avec {provider.name}
              </span>
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
    authOptions
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
