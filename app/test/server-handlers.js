import { rest } from "msw";
import { testUser, userProjects } from "./index";

const delay = process.env.NODE_ENV === "test" ? 0 : 1500;

const handlers = [
  // rest.get("/api/users/me", async (req, res, ctx) => {
  //   console.log("MOCKING /api/users/me ", req);
  //   return res(
  //     ctx.delay(delay),
  //     ctx.json({
  //       artistName: "José",
  //       slug: "jose",
  //       pk: "ARTIST",
  //       sk: "sk123",
  //       projects: "",
  //       uuid: "123456789",
  //     })
  //   );
  // }),
  rest.get("/api/users/me", async (req, res, ctx) => {
    return res(ctx.json(testUser));
  }),
  rest.get("/api/projects/me", async (req, res, ctx) => {
    return res(ctx.delay(300), ctx.json(userProjects));
  }),
];

export { handlers };
