import React, { useState, useEffect } from "react";
import Router from "next/router";

const New: React.FC = () => {
  const [artistName, setArtistName] = useState("");
  const [visibleForm, setVisibleForm] = useState(true);

  const fetchPublicProfile = async () => {
    const res = await fetch("/api/users/me");
    const data = await res.json();
    if (data.artistName) {
      setArtistName(data.artistName);
    }
  };

  useEffect(() => {
    fetchPublicProfile();
  }, []);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setVisibleForm(false);
    try {
      const body = { artistName };
      await fetch("/api/users/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/me");
    } catch (error) {
      setVisibleForm(true);
      console.error(error);
    }
  };

  const cssInput =
    "w-full text-5xl h-20 mt-0 pt-0 mb-4 bg-jam-light-transparent text-white";

  return (
    <>
      <div>
        <form onSubmit={submitData}>
          <h1 className="text-5xl mb-6 ">My Artist Profile</h1>
          <label>
            <span className="text-3xl">Artist Name</span>{" "}
            <span className="text-3xl  text-jam-pink">*</span>
            <input
              autoFocus
              onChange={(e) => setArtistName(e.target.value)}
              type="text"
              value={artistName}
              className={cssInput}
            />
          </label>

          <div className="w-full ">
            <input
              className={`text-xl mx-auto block text-white rounded-md px-4 py-2 leading-none  bg-jam-purple border-b-4 border-jam-pink disabled:opacity-50 disabled:border-none disabled:cursor-not-allowed ${
                !visibleForm && "opacity-10"
              }
            `}
              disabled={!artistName || !visibleForm}
              type="submit"
              value="Set Artist Name"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default New;
