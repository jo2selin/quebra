import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "../../libs/fetcher";
import { useSession } from "next-auth/react";
import AccessDenied from "../../components/access-denied";

interface Slug {
  slug: string;
}
interface ProjectEdit {
  project: Project;
  artist: Artist;
  tracks: Tracks[];
}

function ContentEditProject({ project, artist, tracks }: ProjectEdit) {
  return (
    <>
      <h1 className="text-5xl mb-6 ">EDIT {project.projectName}</h1>
      <h1 className="text-5xl mb-6 ">Artist {artist.artistName}</h1>
      {tracks.length < 1 && <p>No tracks yet</p>}
      {tracks && (
        <ul>
          {tracks.map((track) => (
            <li key={track.sk} className="text-xl mb-6 ">
              {track.track_name}
            </li>
          ))}
        </ul>
      )}
      {/* <label>
          <span className="text-3xl">Artist Name</span>{" "}
          <input
            disabled
            type="text"
            value={project.artistName}
            className={cssInput + " opacity-50 cursor-not-allowed"}
          />
        </label> */}
    </>
  );
}

export default function EditProject({ slug }: Slug) {
  const { data, error, isLoading } = useSWR(`/api/projects/${slug}`, fetcher);
  const { data: session, status } = useSession();
  const {
    data: artist,
    error: artistError,
    isLoading: artistIsLoading,
  } = useSWR(`/api/users/${session?.user?.email}`, fetcher);
  const {
    data: tracks,
    error: tracksError,
    isLoading: tracksIsLoading,
  } = useSWR(`/api/projects/${slug}/tracks`, fetcher);

  if (status !== "authenticated") {
    console.log("!session", session);

    return <AccessDenied />;
  }

  if (error) return <div>failed to load this project</div>;
  if (artistError) return <div>failed to load your artist profile</div>;
  if (isLoading) return <div>loading project...</div>;
  if (artistIsLoading) return <div>loading artist...</div>;
  if (data.email === session.user?.email) {
    return (
      <ContentEditProject project={data} artist={artist} tracks={tracks} />
    );
  } else {
    throw new Error("You are not the owner of this project");
  }
}
