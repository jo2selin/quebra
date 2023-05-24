import React from "react";
import Router from "next/router";
import Image from "next/image";
import Link from "next/link";

type propsType = {
  project: Project;
};

const addTolocalStorage = (uuid: string) => {
  const views = localStorage.getItem(`views`) || JSON.stringify([]);
  const viewsParsed = JSON.parse(views);
  window.localStorage.setItem(`views`, JSON.stringify([...viewsParsed, uuid]));
};

const addViewToDB = async (a_uuid: String, p_uuid: String) => {
  try {
    await fetch(`/api/projects/${a_uuid}/${p_uuid}/views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify(body),
    });
  } catch (error) {
    console.error(error);
  }
};

export default function Counter({
  project: p,
  artist,
}: ProjectsWithArtistsData) {
  React.useEffect(() => {
    const views = localStorage.getItem(`views`);

    if (!views || !views?.includes(p.uuid)) {
      addTolocalStorage(p.uuid);
      // todo : Save +1.2 to DBB
      addViewToDB(artist.uuid, p.uuid);
      return;
    } else {
      return;
    }
  }, [p, artist]);

  return <></>;
}
