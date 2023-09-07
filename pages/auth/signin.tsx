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
    <div className="flex flex-col items-center justify-center">
      <div className=" rounded-xl border-2 border-jam-purple pb-4">
        <h1 className="mx-auto w-full -translate-y-4 text-center text-4xl">
          &quot;Premier venu&quot;
        </h1>
        <ul>
          <li className="px-4 pb-5 text-2xl">
            ✅ Creez un projet et Uploadez vos pistes audio
          </li>
          <li className="px-4 pb-5 text-2xl">
            ✅ Visibilité et partage facile
          </li>
          <li className="px-4 pb-5 text-2xl">✅ fAITES VOUS REMARQUER</li>
          <li className="px-4 pb-5 text-2xl">
            ✅ Accès depuis n&apos;importe où
          </li>
        </ul>
      </div>
      <div className="mb-8 w-full -translate-y-4 text-center ">
        <span className="rounded-xl border-2 border-green-500 bg-jam-dark-purple px-3 py-2 text-white ">
          Gratuit
        </span>
      </div>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className={`mb-4 inline-block rounded-md  border-b-4 border-jam-pink bg-jam-purple px-4 py-2 text-2xl leading-none text-white hover:text-white`}
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
