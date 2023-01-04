import React from "react";

import Router from "next/router";
import useSWR from "swr";
import SetYourArtistProfile from "../../components/setYourArtistProfile";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProjectCreate: React.FC = () => {
  const [projectName, setProjectName] = React.useState("");
  const [visibleForm, setVisibleForm] = React.useState(true);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setVisibleForm(false);
    try {
      const body = { projectName };
      await fetch("/api/me/projects/", {
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

  const { data, error, isLoading } = useSWR("/api/me/profile/", fetcher);
  console.log("swr", data);
  if (error) return <div>failed to load Artist Profile</div>;
  if (isLoading) return <div>loading Artist Profile...</div>;
  if (data.artistName && data.sk && data.pk && data.slug) {
    return (
      <>
        <h1 className="text-xl mb-6 ">Infos about your project</h1>
        <label>
          <span className="text-3xl">Artist Name</span>{" "}
          <input
            disabled
            type="text"
            value={data.artistName}
            className={cssInput + " opacity-50 cursor-not-allowed"}
          />
        </label>
        <form onSubmit={submitData}>
          <label>
            <span className="text-3xl">Project Name</span>{" "}
            <span className="text-3xl  text-jam-pink">*</span>
            <input
              autoFocus
              onChange={(e) => setProjectName(e.target.value)}
              type="text"
              value={projectName}
              className={cssInput}
            />
          </label>

          <div className="w-full ">
            <input
              className={`text-xl mx-auto block text-white rounded-md px-4 py-2 leading-none  bg-jam-purple border-b-4 border-jam-pink disabled:opacity-50 disabled:border-none disabled:cursor-not-allowed ${
                !visibleForm && "opacity-10"
              }
        `}
              disabled={!projectName || !visibleForm}
              type="submit"
              value="Set Artist Name"
            />
          </div>
        </form>
      </>
    );
  } else {
    return <SetYourArtistProfile />;
  }
};

export default ProjectCreate;
