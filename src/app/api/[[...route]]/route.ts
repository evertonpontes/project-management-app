import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";

const app = new Hono().basePath("/api").route("/auth", auth);

const route = app;

const GET = handle(app);
const POST = handle(app);
const PATCH = handle(app);
const PUT = handle(app);
const DELETE = handle(app);

export { GET, POST, PATCH, PUT, DELETE };

export type AppType = typeof route;
