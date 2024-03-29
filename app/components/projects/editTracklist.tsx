import React, { useState } from "react";
import { cssButtonPrimary } from "../../libs/css";

interface TypeeditTracklist {
  tracks: Track[];
  artist: Artist;
  project: Project;
  statusLocal: string;
}
interface TypeTrack {
  track: Track;
  artist: Artist;
  project: Project;
  statusLocal: string;
}
interface TypeDeleteTrack {
  track: Track;
  artist: Artist;
  project: Project;
  setLoadingDelete?: Function;
  setIsDeleted?: Function;
}
interface TypeUpdateTrack {
  track: Track;
  artist: Artist;
  project: Project;
  trackName: string;
  trackNumber: string;
  statusLocal?: string;
  setRes?: Function;
  setOldTrackName?: Function;
  setOldTrackNumber?: Function;
  setLoadingSave?: Function;
  setIsDeleted?: Function;
  isDeleted?: boolean;
}

async function updateTrack({
  track,
  artist,
  project,
  trackName,
  trackNumber,
  setOldTrackName,
  setOldTrackNumber,
  setLoadingSave,
}: TypeUpdateTrack) {
  try {
    if (setLoadingSave) setLoadingSave(true);
    await fetch(
      `/api/projects/${artist.uuid}/${project.uuid}/tracks/${track.uuid}?newTrackName=${trackName}&newTrackNumber=${trackNumber}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackName: trackName }),
      },
    ).then((res) => {
      if (setOldTrackName && setOldTrackNumber && setLoadingSave) {
        setOldTrackName(trackName);
        setOldTrackNumber(trackNumber);
        setLoadingSave(false);
      }
    });
  } catch (error) {
    // setVisibleForm(true);
    console.error(error);
  }
}

async function deleteTrack({
  artist,
  project,
  track,
  setLoadingDelete,
  setIsDeleted,
}: TypeDeleteTrack) {
  try {
    if (setLoadingDelete) setLoadingDelete(true);
    await fetch(
      `/api/projects/${artist.uuid}/${project.uuid}/tracks/${track.uuid}?slug=${track.slug}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackName: "trackName",
          path_s3: project.path_s3,
        }),
      },
    ).then((res) => {
      if (setLoadingDelete) setLoadingDelete(true);
      if (setIsDeleted) setIsDeleted(true);
    });
  } catch (error) {
    // setVisibleForm(true);
    console.error(error);
  }
}

const Track = ({ track, artist, project, statusLocal }: TypeTrack) => {
  const [trackName, setTrackName] = React.useState(track.track_name);
  const [trackNumber, setTrackNumber] = React.useState(track.track_id);
  const [isDeleted, setIsDeleted] = React.useState(false);
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    // console.log(ref.current.value);
    if (trackNumber === 1) {
      ref.current.focus();
    }
  }, [track.track_id, statusLocal]);

  React.useEffect(() => {
    setTrackName(track.track_name);
  }, [track]);

  return (
    <div className={`mt-3 flex ${isDeleted ? "opacity-10" : ""}`}>
      <div className="mr-5 w-20">
        <input
          type="text"
          value={trackNumber}
          onChange={(e) => setTrackNumber(+e.target.value)}
          className={` mr-5 w-20 bg-jam-dark-grey p-3 text-3xl`}
          disabled={statusLocal === "PUBLISHED" ? true : false}
        />
        <input
          type="text"
          value={track.slug + ".mp3"}
          disabled
          className={` mr-5 w-20 bg-jam-dark-purple  text-sm font-thin  text-gray-500`}
        />
        {/* <audio
          controls
          src={`https://quebra-bucket.s3.eu-west-1.amazonaws.com/projects/${project.uuid}/${track.slug}.mp3`}
        /> */}
      </div>
      <div className="relative w-full bg-jam-dark-grey">
        <input
          type="text"
          value={trackName}
          onChange={(t) => setTrackName(t.target.value)}
          placeholder="track title"
          className={`mt-0 mb-0 h-10 w-full bg-jam-dark-grey px-2 pt-0 text-2xl text-white `}
          disabled={statusLocal === "PUBLISHED" ? true : false}
          ref={ref}
        />
        {statusLocal !== "PUBLISHED" && (
          <TrackAction
            track={track}
            artist={artist}
            project={project}
            trackName={trackName}
            trackNumber={trackNumber.toString()}
            setIsDeleted={setIsDeleted}
            isDeleted={isDeleted}
            statusLocal={statusLocal}
          />
        )}
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
  setIsDeleted,
  isDeleted,
  statusLocal,
}: TypeUpdateTrack) => {
  const [oldTrackName, setOldTrackName] = React.useState(track.track_name);
  const [oldTrackNumber, setOldTrackNumber] = React.useState(
    track.track_id.toString(),
  );
  const [displaySave, setDisplaySave] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  React.useEffect(() => {
    function displaySavebtn() {
      if (oldTrackName !== trackName || oldTrackNumber !== trackNumber)
        return true;
      return false;
    }
    setDisplaySave(displaySavebtn());
  }, [track, trackName, trackNumber, oldTrackName, oldTrackNumber]);

  return (
    <>
      <div className="flex items-end justify-end p-2">
        {displaySave && (
          <div
            onClick={() => {
              updateTrack({
                track,
                artist,
                project,
                trackName,
                trackNumber,
                setOldTrackName,
                setOldTrackNumber,
                setLoadingSave,
              });
            }}
            className={`${cssButtonPrimary} ${
              loadingSave ? " cursor-not-allowed opacity-10" : ""
            }`}
          >
            Save
          </div>
        )}
        {!isDeleted && statusLocal === "DRAFT" && (
          <div
            onClick={() =>
              deleteTrack({
                artist,
                project,
                track,
                setLoadingDelete,
                setIsDeleted,
              })
            }
            className={`${cssButtonPrimary} 
            border-b-4 border-jam-light-purple bg-[#323232] ${
              loadingDelete ? " cursor-not-allowed opacity-10" : ""
            }`}
          >
            Delete
          </div>
        )}
      </div>
      <div
        className={`${
          displaySave ? "bg-red-400" : "bg-green-400"
        }  absolute bottom-0 z-10 h-1 w-full text-center`}
      />
    </>
  );
};

export default function editTracklist({
  tracks,
  artist,
  project,
  statusLocal,
}: TypeeditTracklist) {
  const orderedTracks = tracks.sort((a, b) => +a.track_id - +b.track_id);

  const statusEdition =
    statusLocal === "DRAFT" || statusLocal === "UNPUBLISHED";
  return (
    <div className="max-w-screen-md ">
      {tracks[0] && statusEdition && (
        <div className="border-l-8 border-jam-purple pl-3 ">
          <h2 className="mb-1 text-3xl ">Pistes prête pour l&apos;édition:</h2>
          <h3 className="mb-6 font-serif text-sm normal-case opacity-80 ">
            Ordre et nom des pistes
          </h3>
        </div>
      )}
      {orderedTracks &&
        orderedTracks.map((track, i) => (
          <Track
            key={track.uuid}
            track={track}
            artist={artist}
            project={project}
            statusLocal={statusLocal}
          />
        ))}
    </div>
  );
}
