const IS_BROWSER = typeof window !== "undefined";

export const setupMocks = async () => {
  console.log("IS_BROWSER", IS_BROWSER);
  if (IS_BROWSER) {
    const { mswWorker } = await import("./mswWorker");
    mswWorker.start();
  } else {
    const { mswServer } = await import("./mswServer");
    mswServer.listen();
  }
};

export const testUser = {
  artistName: "Jose 93",
  slug: "jose-93",
  pk: "ARTIST",
  sk: "09382409284098",
  projects: "",
  uuid: "9832948094283098423",
};
