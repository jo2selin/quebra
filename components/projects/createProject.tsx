import React from "react";
import Router from "next/router";
import SetYourArtistProfile from "../../components/setYourArtistProfile";
import useSWR from "swr";
import { fetcher } from "../../libs/fetcher";
import { cssInput } from "../../libs/css";

export default function CreateProject() {
  const [projectName, setProjectName] = React.useState("");
  const [visibleForm, setVisibleForm] = React.useState(true);

  const regex =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setVisibleForm(false);
    try {
      if (projectName.replace(regex, "").length <= 3) {
        setProjectName("");
        throw new Error("Name too short");
      }
      const body = { projectName };
      await fetch("/api/projects/", {
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

  const { data, error, isLoading } = useSWR("/api/users/me", fetcher);
  // const { data:myProjects, error:pError} = useSWR("/api/projects/me", fetcher);

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
            {projectName && projectName.replace(regex, "").length <= 3 && (
              <p className="text-sm text-red-500">project name too short</p>
            )}
            <input
              className={`text-xl mx-auto block text-white rounded-md px-4 py-2 leading-none  bg-jam-purple border-b-4 border-jam-pink cursor-pointer disabled:opacity-50 disabled:border-none disabled:cursor-not-allowed ${
                !visibleForm && "opacity-10"
              }
        `}
              disabled={
                !projectName ||
                !visibleForm ||
                projectName.replace(regex, "").length <= 3
              }
              type="submit"
              value="Create a project"
            />
          </div>
        </form>
      </>
    );
  } else {
    return <SetYourArtistProfile />;
  }
}
