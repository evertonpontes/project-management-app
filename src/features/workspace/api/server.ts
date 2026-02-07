import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { createWorkspaceSchema } from "../schemas";
import { authMiddleware } from "@/lib/auth-middleware";
import {
  API_ENDPOINT,
  PROJECT_ID,
  STORAGE_ID,
  USER_ROLES,
  USER_ROLES_WORKSPACE,
} from "../config";

const app = new Hono()
  .get("/", authMiddleware, async (c) => {
    const tables = c.get("tables");
    const user = c.get("user");

    // Return all workspaces where user is member
    const workspaceMember = await tables.listRows({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "workspace-member",
      queries: [Query.equal("memberId", [user.$id])],
    });

    // If user is not member of any workspace return empty array
    if (workspaceMember.total === 0)
      return c.json({ data: { total: 0, rows: [] } });

    // Map the id of each workspace
    const workspacesId: string[] = workspaceMember.rows.map(
      (workspace) => workspace.workspaceId,
    );

    // Query all workspaces where id is in workspacesId
    const workspaces = await tables.listRows({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "workspaces",
      total: true,
      queries: [Query.equal("$id", workspacesId)],
    });

    return c.json({ data: workspaces });
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
      } else {
        imageUploadedUrl = file;
      }

      const workspace = await tables.createRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId: "workspaces",
        rowId: ID.unique(),
        data: {
          name,
          userId: user.$id,
          imageUrl: imageUploadedUrl,
        },
      });

      await tables.createRow({
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId: "workspace-member",
        rowId: ID.unique(),
        data: {
          memberId: user.$id,
          workspaceId: workspace.$id,
          joinDate: new Date().toISOString(),
          role: USER_ROLES.owner,
          permissions: JSON.stringify(USER_ROLES_WORKSPACE.owner),
        },
      });

      return c.json({ message: "Workspace created successfully" }, 201);
    },
  )
  .get("/:workspaceId", authMiddleware, async (c) => {
    const workspaceId = c.req.param("workspaceId");
    const tables = c.get("tables");

    const workspace = await tables.getRow({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "workspaces",
      rowId: workspaceId,
    });

    return c.json({ data: workspace });
  });

export default app;
