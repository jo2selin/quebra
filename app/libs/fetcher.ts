export const fetcher = async (url: string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error() as any;
    // Attach extra info to the error object.
    const resError = await res.json();
    error.statusText =
      resError.error || "An error occurred while fetching the data.";
    error.status = res.status;

    throw error;
  }

  return res.json();
};
