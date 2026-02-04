import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";

import { createWorkspaceSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { authMiddleware } from "@/lib/auth-middleware";
import { errorApi } from "@/lib/error-api";

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspaceSchema),
  authMiddleware,
  async (c) => {
    const { name } = c.req.valid("json");

    return c.json(
      { success: true, message: "Workspace created successfully" },
      201,
    );
  },
);

export default app;
