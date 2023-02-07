import React, { useState } from "react";
import { useS3Upload, getImageData } from "next-s3-upload";
import Image from "next/image";
import { cssInput } from "../../libs/css";
import Button from "../button";

interface TypeeditTracklist {
  tracks: Tracks[];
  artist: Artist;
  project: Project;
}
interface TypeTrack {
  track: Tracks;
  artist: Artist;
  project: Project;
}
interface TypeUpdateTrack {
  track: Tracks;
  artist: Artist;
  project: Project;
  trackName: string;
  trackNumber: string;
  setRes?: Function;
  setOldTrackName?: Function;
  setOldTrackNumber?: Function;
}

//  todo GERER NUM TRACK + ERRORS
//  TODO RESFRESH TRACK APRES RES de lupdate

async function updateTrack({
  track,
  artist,
  project,
  trackName,
  trackNumber,
  setOldTrackName,
  setOldTrackNumber,
}: TypeUpdateTrack) {
  try {
    await fetch(
      `/api/projects/${artist.uuid}/${project.uuid}/tracks/${track.uuid}?newTrackName=${trackName}&newTrackNumber=${trackNumber}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackName: trackName }),
      }
    ).then((res) => {
      if (setOldTrackName && setOldTrackNumber) {
        console.log("set oldTrackName to ", trackName);

        setOldTrackName(trackName);
        setOldTrackNumber(trackNumber);
      }
    });
  } catch (error) {
    // setVisibleForm(true);
    console.error(error);
  }
}

const Track = ({ track, artist, project }: TypeTrack) => {
  const [trackName, setTrackName] = React.useState(track.track_name || "");
  const [trackNumber, setTrackNumber] = React.useState(track.track_id || "");

  React.useEffect(() => {
    setTrackName(track.track_name);
  }, [track]);

  return (
    <div className="flex mt-3 ">
      <div className="">
        <input
          type="text"
          value={trackNumber}
          onChange={(e) => setTrackNumber(e.target.value)}
          className={` bg-jam-dark-grey w-20 mr-5 p-6 text-3xl`}
        />
        {/* <audio
          controls
          src={`https://quebra-bucket.s3.eu-west-1.amazonaws.com/projects/${project.uuid}/${track.slug}.mp3`}
        /> */}
      </div>
      <div className="w-full bg-jam-dark-grey">
        <input
          type="text"
          value={trackName}
          onChange={(t) => setTrackName(t.target.value)}
          placeholder="track title"
          className={`w-full h-10 mt-0 pt-0 px-2 bg-jam-dark-grey text-white text-2xl mb-0 `}
        />
        <TrackAction
          track={track}
          artist={artist}
          project={project}
          trackName={trackName}
          trackNumber={trackNumber}
        />
      </div>
    </div>
  );
};

const TrackAction = ({
  track,
  artist,
  project,
  trackName,
  trackNumber,
}: TypeUpdateTrack) => {
  const [oldTrackName, setOldTrackName] = React.useState(track.track_name);
  const [oldTrackNumber, setOldTrackNumber] = React.useState(track.track_id);
  const [displaySave, setDisplaySave] = useState(false);
  console.log("track", track);
  console.log("trackName", trackName);

  React.useEffect(() => {
    console.log(
      "oldTrackName,trackName",
      oldTrackName,
      trackName,
      oldTrackNumber,
      trackNumber
    );

    function displaySavebtn() {
      if (oldTrackName !== trackName || oldTrackNumber !== trackNumber)
        return true;
      return false;
    }
    setDisplaySave(displaySavebtn());
  }, [track, trackName, trackNumber, oldTrackName, oldTrackNumber]);

  return (
    <>
      <div className="flex p-2 items-end justify-end">
        {displaySave && (
          <div
            onClick={() =>
              updateTrack({
                track,
                artist,
                project,
                trackName,
                trackNumber,
                setOldTrackName,
                setOldTrackNumber,
              })
            }
            className="inline-block text-md text-white  rounded-md px-4 py-2 leading-none hover:text-white text-sm mr-2
          bg-jam-purple border-b-4 border-jam-pink cursor-pointer"
          >
            Save
          </div>
        )}
        <div
          className=" inline-block text-md text-white  rounded-md px-4 py-2 leading-none hover:text-white text-sm mr-2
        bg-[#323232] border-b-4 border-jam-light-purple cursor-pointer"
        >
          Delete
        </div>
      </div>
      <div
        className={`h-1 ${
          displaySave ? "bg-red-400" : "bg-green-400"
        }  text-center`}
      />
    </>
  );
};

// TODO GERER ledition des tracks

export default function editTracklist({
  tracks,
  artist,
  project,
}: TypeeditTracklist) {
  const orderedTracks = tracks.sort((a, b) => a.track_id - b.track_id);
  console.log("orderedTracks", orderedTracks);

  return (
    <>
      {tracks && <p className="pt-12">Tracks ready for edition:</p>}
      {orderedTracks &&
        orderedTracks.map((track, i) => (
          <Track key={i} track={track} artist={artist} project={project} />
        ))}
    </>
  );
}
