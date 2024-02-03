import { rest } from "msw";
import { testUser, userProjects } from "./index";

const delay = process.env.NODE_ENV === "test" ? 0 : 1500;

const handlers = [
  rest.get("/api/users/me", async (req, res, ctx) => {
    return res(ctx.json(testUser));
  }),
  rest.get("/api/projects/me", async (req, res, ctx) => {
    return res(ctx.delay(300), ctx.json(userProjects));
  }),
];

export { handlers };
