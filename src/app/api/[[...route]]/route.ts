import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/features/auth/api/server";
import workspace from "@/features/workspace/api/server";

const app = new Hono().basePath("/api");

const route = app.route("/auth", auth).route("/workspace", workspace);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof route;
