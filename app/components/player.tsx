import React from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface Player {
  tracks: Track[];
  p_slug: string;
  currentTrack: number;
  setTrackIndex: Function;
}
interface Playlist {
  src: string;
  name: string;
}

export default function Player({
  tracks,
  p_slug,
  currentTrack,
  setTrackIndex,
}: Player) {
  let playlist = [] as Playlist[];

  tracks.forEach((track: any) => {
    const fullSlug = `https://quebra-bucket.s3.amazonaws.com/projects/${p_slug}/${track.slug}.mp3`;
    playlist = [
      ...playlist,
      { src: fullSlug, name: track.track_name },
    ] as Playlist[];
  });

  // const [currentTrack, setTrackIndex] = React.useState(0);
  const handleClickNext = () => {
    setTrackIndex((currentTrack: number) =>
      currentTrack < playlist.length - 1 ? currentTrack + 1 : 0,
    );
  };

  const handleEnd = () => {
    const playlistEnded = currentTrack >= playlist.length - 1;
    if (playlistEnded) {
      return;
    } else {
      setTrackIndex((currentTrack: number) => currentTrack + 1);
    }
  };

  return (
    <AudioPlayer
      src={playlist[currentTrack].src}
      showSkipControls
      showJumpControls={false}
      onClickNext={handleClickNext}
      onEnded={handleEnd}
      // other props here
    />
  );
}
