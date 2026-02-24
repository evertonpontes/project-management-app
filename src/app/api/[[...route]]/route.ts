import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import workspace from "@/features/workspace/server/route";
import member from "@/features/member/server/route";
import taskField from "@/features/task-field/server/route";

const app = new Hono()
  .basePath("/api")
  .route("/auth", auth)
  .route("/workspace", workspace)
  .route("/member", member)
  .route("/task-field", taskField);

const route = app;

const GET = handle(app);
const POST = handle(app);
const PATCH = handle(app);
const PUT = handle(app);
const DELETE = handle(app);

export { GET, POST, PATCH, PUT, DELETE };

export type AppType = typeof route;
