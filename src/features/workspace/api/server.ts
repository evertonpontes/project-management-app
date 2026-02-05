import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { createWorkspaceSchema } from "../schemas";
import { authMiddleware } from "@/lib/auth-middleware";
import {
  API_ENDPOINT,
  DATABASE_ID,
  PROJECT_ID,
  STORAGE_ID,
  USER_ROLES_WORKSPACE,
} from "../constants";

const app = new Hono()
  .get("/", authMiddleware, async (c) => {
    const tables = c.get("tables");
    const user = c.get("user");

    const workspaceMember = await tables.listRows({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "workspace-member",
      queries: [Query.equal("memberId", [user.$id])],
    });

    if (workspaceMember.total === 0) return c.json({ success: true, data: [] });

    const workspacesId: string[] = workspaceMember.rows.map(
      (workspace) => workspace.workspaceId,
    );

    const workspaces = await tables.listRows({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "workspaces",
      total: true,
      queries: [Query.equal("$id", workspacesId)],
    });

    return c.json({ success: true, data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    authMiddleware,
    async (c) => {
      const { name, file } = c.req.valid("form");
      const tables = c.get("tables");
      const storage = c.get("storage");
      const user = c.get("user");

      let imageUploadedUrl: string | undefined;

      if (file && file instanceof File) {
        const fileUploaded = await storage.createFile({
          bucketId: STORAGE_ID,
          fileId: ID.unique(),
          file: file,
        });

        imageUploadedUrl =
          API_ENDPOINT +
          "/storage/buckets/" +
          STORAGE_ID +
          "/files/" +
          fileUploaded.$id +
          "/view?project=" +
          PROJECT_ID;
      }

      const workspace = await tables.createRow({
        databaseId: DATABASE_ID,
        tableId: "workspaces",
        rowId: ID.unique(),
        data: {
          name,
          userId: user.$id,
          imageUrl: imageUploadedUrl,
        },
      });

      await tables.createRow({
        databaseId: DATABASE_ID,
        tableId: "workspace-member",
        rowId: ID.unique(),
        data: {
          memberId: user.$id,
          workspaceId: workspace.$id,
          joinDate: new Date().toISOString(),
          role: "owner",
          permissions: JSON.stringify(USER_ROLES_WORKSPACE.owner),
        },
      });

      return c.json(
        { success: true, message: "Workspace created successfully" },
        201,
      );
    },
  )
  .get("/:id", authMiddleware, async (c) => {
    const workspaceId = c.req.param("id");
    const tables = c.get("tables");

    const workspace = await tables.getRow({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "workspaces",
      rowId: workspaceId,
    });

    return c.json({ success: true, data: workspace });
  });

export default app;
