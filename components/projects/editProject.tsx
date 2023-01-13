import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "../../libs/fetcher";
import { useSession } from "next-auth/react";
import AccessDenied from "../../components/access-denied";

interface Slug {
  slug: string;
}

function ContentEditProject({ slug }: Slug) {
  return (
    <>
      <p>EDIT {slug}</p>
    </>
  );
}

export default function EditProject({ slug }: Slug) {
  const { data, error, isLoading } = useSWR(`/api/projects/${slug}`, fetcher);
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    console.log("!session", session);

    return <AccessDenied />;
  }

  if (error) return <div>failed to load this project</div>;
  if (isLoading) return <div>loading project...</div>;
  if (data.email === session.user?.email) {
    return <ContentEditProject slug={slug} />;
  } else {
    throw new Error("You are not the owner of this project");
  }
}
