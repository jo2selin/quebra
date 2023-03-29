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
    const fullSlug = `http://quebra-bucket.s3.amazonaws.com/projects/${p_slug}/${track.slug}.mp3`;
    playlist = [
      ...playlist,
      { src: fullSlug, name: track.track_name },
    ] as Playlist[];
  });

  console.log("playlist", playlist);

  // const playlist = [
  //   { src: 'https://hanzluo.s3-us-west-1.amazonaws.com/music/ziyounvshen.mp3' },
  //   { src: 'https://hanzluo.s3-us-west-1.amazonaws.com/music/wuyuwuqing.mp3' },
  //   { src: 'https://hanzluo.s3-us-west-1.amazonaws.com/music/suipian.mp3' },
  // ]

  // const [currentTrack, setTrackIndex] = React.useState(0);
  const handleClickNext = () => {
    console.log("click next");
    setTrackIndex((currentTrack: number) =>
      currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
    );
  };

  const handleEnd = () => {
    console.log("end");
    setTrackIndex((currentTrack: number) =>
      currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
    );
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
