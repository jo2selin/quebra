import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex justify-center items-center flex-col">
      <div className=" border-2 border-jam-purple rounded-xl pb-4">
        <h1 className="text-4xl mx-auto -translate-y-4 w-full text-center">
          &quot;Premier venu&quot;
        </h1>
        <ul>
          <li className="text-2xl pb-5 px-4">
            ✅ Creez un projet et Uploadez vos pistes audio
          </li>
          <li className="text-2xl pb-5 px-4">
            ✅ Visibilité et partage facile
          </li>
          <li className="text-2xl pb-5 px-4">✅ fAITES VOUS REMARQUER</li>
          <li className="text-2xl pb-5 px-4">
            ✅ Accès depuis n&apos;importe où
          </li>
        </ul>
      </div>
      <div className="w-full text-center -translate-y-4 mb-8 ">
        <span className="rounded-xl border-2 bg-jam-dark-purple border-green-500 text-white px-3 py-2 ">
          Gratuit
        </span>
      </div>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className={`inline-block text-2xl text-white  rounded-md px-4 py-2 mb-4 leading-none hover:text-white bg-jam-purple border-b-4 border-jam-pink`}
            onClick={() => signIn(provider.id)}
          >
            Se connecter avec {provider.name}
          </button>
        </div>
      ))}
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
