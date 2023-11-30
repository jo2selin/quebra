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

export const userProjects = [
  {
    created_at: "2023-04-25T18:03:55.607Z",
    status: "PUBLISHED",
    slug: "bob-better-than-drugs",
    views: 6,
    cover: "jpg",
    projectName: "Test Project Mixtape test Two",
    path_s3: "t-p-m-t-o",
    validated: "NOPE",
    allow_download: true,
    uuid: "7effe73f-f95c-46b5-9f23-8a5e69fc4f2c",
    sk: "af5f7849-8064-424c-85aa-1ee68c9f1bd5#7effe73f-f95c-46b5-9f23-8a5e69fc4f2c",
    pk: "PROJECT",
  },
];

export const userMaxLimitProjects = [
  {
    created_at: "2023-04-25T18:03:55.607Z",
    status: "PUBLISHED",
    slug: "bob-better-than-drugs",
    views: 6,
    cover: "jpg",
    projectName: "Test Project Mixtape test Two",
    path_s3: "t-p-m-t-o",
    validated: "NOPE",
    allow_download: true,
    uuid: "7effe73f-f95c-46b5-9f23-8a5e69fc4f2c",
    sk: "af5f7849-8064-424c-85aa-1ee68c9f1bd5#7effe73f-f95c-46b5-9f23-8a5e69fc4f2c",
    pk: "PROJECT",
  },

  {
    created_at: "2023-04-28T18:03:55.607Z",
    status: "DRAFT",
    slug: "my-draft-project",
    views: 12,
    cover: "jpg",
    projectName: "My draft Project",
    path_s3: "t-p-m-t-o",
    validated: "NOPE",
    allow_download: true,
    uuid: "7effe73f-f95c-46b5-9f23-8a5e69fc4f00",
    sk: "af5f7849-8064-424c-85aa-1ee68c9f1bd5#7effe73f-f95c-46b5-9f23-8a5e69fc4f00",
    pk: "PROJECT",
  },
];
