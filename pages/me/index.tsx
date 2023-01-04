import { useState, useEffect } from "react";
import Link from "next/link";

import { useSession } from "next-auth/react";
import useSWR from "swr";

// import JamListItem, { JamProps } from "../../components/jam";
import Button from "../../components/button";
import SetYourArtistProfile from "../../components/setYourArtistProfile";
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
  const { data, error, isLoading } = useSWR("/api/me/profile/", fetcher);
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

  // useEffect(() => {
  //   const { data, error } = useSWR("/api/me/profile/", fetcher);

  //   return () => {
  //     second
  //   }
  // }, [third])

  // const [jams, setJams] = useState<Jams>();
  // const [showNameForm, setShowNameForm] = useState(false);
  // const [newUserSlug, setNewUserSlug] = useState(session?.slug);
  // const [newName, setNewName] = useState("");
  // const [isNameAvailable, setIsNameAvailable] = useState(true);
  // const [loadingNameAvailable, setLoadingNameAvailable] = useState(false);
  // const [formSent, setFormSent] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await fetch(`/api/user/jams/${session?.user?.email}`);
  //     const json = await res.json();
  //     if (json) {
  //       setJams(json);
  //     }
  //   };
  //   fetchData();
  // }, [session, loading]);

  // useEffect(() => {
  //   if (newName === "") {
  //     return;
  //   }
  //   setLoadingNameAvailable(true);
  //   checkNameAvailability(newName)
  //     .then((data) => {
  //       setIsNameAvailable(data.name_available);
  //       return data;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  //     .finally(() => {
  //       setLoadingNameAvailable(false);
  //     });
  // }, [newName]);

  // const handleSubmitFormName = async (e: React.SyntheticEvent) => {
  //   e.preventDefault();
  //   setFormSent(true);
  //   setLoadingNameAvailable(true);
  //   try {
  //     const body = { newName };
  //     await fetch("/api/user/updateName", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(body),
  //     }).then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not OK");
  //       }
  //       setNewUserSlug(newName);
  //       setShowNameForm(false);
  //       setFormSent(false);
  //       setLoadingNameAvailable(false);
  //     });
  //   } catch (error) {
  //     // setVisibleForm(true);
  //     console.error(error);
  //   }
  // };

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
          {/* <div>
            <p className="px-3 mb-2">My profile url:</p>
            <p className="text-white font-mono lowercase bg-jam-light-transparent px-3 py-2 rounded-md">
              {`https://my-jam.vercel.app/${
                newUserSlug ? newUserSlug : session.slug
              }`}
            </p>
            {!showNameForm && (
              <button
                className="text-right w-full"
                onClick={() => setShowNameForm(!showNameForm)}
              >
                Edit name and url
              </button>
            )}
            {showNameForm && (
              <div className="flex justify-end">
                <form onSubmit={handleSubmitFormName} className="pt-5">
                  <label>
                    <input
                      type="text"
                      value={newName}
                      className="px-2 py-1 bg-jam-light-transparent text-white font-mono lowercase"
                      onChange={(e) =>
                        setNewName(e.target.value.toLocaleLowerCase())
                      }
                    />
                  </label>
                  <button
                    className={`mx-2 bg-jam-purple rounded px-2 py-1  ${
                      loadingNameAvailable || !isNameAvailable
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    disabled={loadingNameAvailable || !isNameAvailable}
                  >
                    {formSent && (
                      <Image
                        className="animate-spin mr-2"
                        src="/loader.svg"
                        alt=""
                        width={12}
                        height={12}
                      />
                    )}
                    Submit
                  </button>
                  <span
                    onClick={() => setShowNameForm(false)}
                    className="mx-2  rounded px-1 py-1 cursor-pointer"
                  >
                    Cancel
                  </span>
                  {!isNameAvailable && (
                    <p className="text-red-500 ">Name already taken</p>
                  )}
                  <p>
                    my-jam.vercel.app/
                    <span className="text-jam-pink">
                      <>
                        {!newName && session.slug}
                        {newName &&
                          slugify(newName, {
                            lower: true,
                          }).substring(0, 30)}
                      </>
                    </span>
                  </p>
                </form>
              </div>
            )}
          </div> */}
        </div>

        {/* <div className="md:flex-1 md:ml-10">
          <h1 className=" text-5xl">My Jams</h1>
          <ul className=" px-3 py-5 mt-5">
            {jams &&
              jams.map((jam) => {
                return (
                  <li key={jam.id} className="px-3 py-5 ">
                    <JamListItem jam={jam} me={true} />
                    <div onClick={() => archiveJam(jam.id)}>
                      <Button to={"#"}>Delete</Button>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div> */}
      </div>
    </>
  );
};

export default Me;
