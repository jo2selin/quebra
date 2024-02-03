import React, { useState, useEffect } from "react";
import Button from "../button";
import useSWR, { useSWRConfig } from "swr";

type PropsSetArtistProfile = {
  setShowsetArtist: (active: boolean) => void;
  user: any;
};

const SetArtistProfile = ({
  setShowsetArtist,
  user,
}: PropsSetArtistProfile) => {
  const [artistName, setArtistName] = useState(
    user.artistName ? user.artistName : "",
  );
  const [visibleForm, setVisibleForm] = useState(true);
  const [artistNameValid, setArtistNameValid] = useState(false);

  const { mutate } = useSWRConfig();

  useEffect(() => {
    // define if name is valid
    const regex =
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    if (artistName.trim().replace(regex, "").length >= 3) {
      setArtistNameValid(true);
    } else {
      setArtistNameValid(false);
    }
  }, [artistName]);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (!artistNameValid) {
        setArtistName("");
        throw new Error("Name too short");
      }

      setVisibleForm(false);
      const body = { artistName };

      await fetch("/api/users/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      // close form
      mutate("/api/users/me");
      setShowsetArtist(false);
    } catch (error) {
      setVisibleForm(true);
      console.error(error);
    }
  };

  const cssInput =
    "w-full text-5xl h-20 mt-0 pt-0 pl-3 mb-4 bg-jam-light-transparent text-white";

  return (
    <>
      <div>
        <form onSubmit={submitData}>
          <div className="mb-6 flex  items-center">
            <span onClick={() => setShowsetArtist(false)}>
              <Button className="min-w-max text-sm " style={"dark"}>
                {"< Retour"}
              </Button>
            </span>
          </div>

          <label>
            <span className="text-3xl">Nom d&apos;artiste</span>{" "}
            <span className="text-3xl  text-jam-pink">*</span>
            <input
              autoFocus
              onChange={(e) => {
                setArtistName(e.target.value);
              }}
              type="text"
              value={artistName}
              className={cssInput}
            />
          </label>

          <div className="w-full ">
            {artistName && !artistNameValid && (
              <p className="text-sm text-red-500">
                Nom d&apos;artiste trop court
              </p>
            )}
            <input
              className={`mx-auto block cursor-pointer rounded-md border-b-4 border-jam-pink bg-jam-purple px-4  py-2 text-xl leading-none text-white disabled:cursor-not-allowed disabled:border-none disabled:opacity-50 ${
                !visibleForm && "opacity-10"
              }
            `}
              disabled={!artistName || !visibleForm || !artistNameValid}
              type="submit"
              value="Enregistrer nom"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default SetArtistProfile;
