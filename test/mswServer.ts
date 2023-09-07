import { setupServer } from "msw/node";
import { handlers } from "./server-handlers";

export const mswServer = setupServer(...handlers);
