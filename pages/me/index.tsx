import { useState, useEffect } from "react";
import Link from "next/link";

import { useSession } from "next-auth/react";
import useSWR from "swr";

// import JamListItem, { JamProps } from "../../components/jam";
import Button from "../../components/button";
import SetYourArtistProfile from "../../components/setYourArtistProfile";
import ArtistProjects from "../../components/artistProjects";
import Router from "next/router";
import slugify from "slugify";

import AccessDenied from "../../components/access-denied";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// async function archiveJam(id: string): Promise<void> {
//   await fetch(`/api/jam/${id}`, {
//     method: "DELETE",
//   });
//   Router.push("/");
// }

// type typeCheckNameAvailability = {
//   name_available: boolean;
// };
// async function checkNameAvailability(
//   newName: string
// ): Promise<typeCheckNameAvailability> {
//   const response = await fetch(`/api/user/checkNameAvailability/${newName}`, {
//     method: "GET",
//   });

//   return response.json();
// }

// async function submitFormName(newName: string) {

// }

// type Jams = JamProps[];

function ArtistProfile() {
  // using an array style key.
  const { data, error, isLoading } = useSWR("/api/users/me/", fetcher);
  console.log("swr", data);
  if (error) return <div>failed to load Artist Profile</div>;
  if (isLoading) return <div>loading Artist Profile...</div>;
  if (data.artistName && data.sk && data.pk) {
    return (
      <div>
        <h1 className="text-5xl uppercase">My Account</h1>
        <div className="mt-12 pl-5">
          <h2 className="text-5xl uppercase">Artist</h2>
          <h3 className="text-4xl uppercase ">
            <Link href={`/${data.slug}`}>{data.artistName}</Link>
          </h3>
          <Button to={"/me/artistProfile"} className="text-sm">
            Edit Artist Infos
          </Button>
        </div>
        <div className="mt-12 pl-5"></div>
      </div>
    );
  } else {
    return <SetYourArtistProfile />;
  }
}

const Me: React.FC = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [artistName, setArtistName] = useState(null);

  if (loading) {
    return <p>loading...</p>;
  }

  // If no session exists, display access denied message
  if (status !== "authenticated") {
    console.log("!session", session);

    return <AccessDenied />;
  }

  return (
    <>
      <div className="md:flex">
        <div className="md:flex-1 mb-20 md:mr-32">
          <div className="flex justify-between items-center pb-5">
            {/* <h2 className="text-5xl ">My Account</h2> */}
          </div>

          <ArtistProfile />
          <ArtistProjects />
        </div>
      </div>
    </>
  );
};

export default Me;
