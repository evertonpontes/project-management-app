import { AppwriteException, ID, Query } from "node-appwrite";

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { createWorkspaceSchema, editWorkspaceSchema } from "../schemas";
import { authMiddleware } from "@/lib/auth-middleware";
import { APPWRITE_DATABASE_ID, APPWRITE_STORAGE_ID } from "../constants";
import { generateInviteCode } from "@/lib/utils";
import { RoleEnum } from "@/features/member/types";
import { getMember } from "@/features/member/queries/get-member";
import z from "zod";
import { Workspace } from "../types";

const store = new Hono()
  .post(
    "/",
    authMiddleware,
    zValidator("form", createWorkspaceSchema),
    async (c) => {
      // CREATE WORKSPACE
      const { name, image } = c.req.valid("form");

      const tablesDB = c.get("tablesDB");
      const user = c.get("user");
      const storage = c.get("storage");

      let imageUrl: string | undefined;

      try {
        if (image && image instanceof File) {
          const fileUploaded = await storage.createFile({
            bucketId: APPWRITE_STORAGE_ID,
            fileId: ID.unique(),
            file: image,
          });

          imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!}/storage/buckets/${APPWRITE_STORAGE_ID}/files/${fileUploaded.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!}`;
        } else {
          imageUrl = image;
        }

        const workspace = await tablesDB.createRow({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: "workspaces",
          rowId: ID.unique(),
          data: {
            name,
            imageUrl,
            ownerId: user.$id,
            inviteCode: generateInviteCode(8),
            workspaceMembers: [{ memberId: user.$id, role: RoleEnum.OWNER }],
          },
        });

        return c.json(
          {
            data: workspace,
          },
          201,
        );
      } catch (error) {
        console.log("CREATE WORKSPACE ERROR: ", error);

        if (error instanceof AppwriteException) {
          return c.json({ error: error.message }, 400);
        }

        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  .get("/", authMiddleware, async (c) => {
    // GET WORKSPACES
    const tablesDB = c.get("tablesDB");
    const user = c.get("user");

    try {
      const workspaces = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "workspaces",
        queries: [
          Query.equal("workspaceMembers.memberId", [user.$id]),
          Query.orderDesc("$createdAt"),
        ],
      });

      return c.json({ data: workspaces }, 200);
    } catch (error) {
      console.log("GET WORKSPACES ERROR: ", error);

      return c.json({ error: "Error fetching workspaces" }, 500);
    }
  })
  .patch(
    "/:workspaceId",
    authMiddleware,
    zValidator("form", editWorkspaceSchema),
    async (c) => {
      // EDIT WORKSPACE
      const workspaceId = c.req.param("workspaceId");
      const { name, image } = c.req.valid("form");

      const tablesDB = c.get("tablesDB");
      const user = c.get("user");
      const storage = c.get("storage");

      let imageUrl: string | undefined;

      // Get the member of workspace
      const member = await getMember({ workspaceId, userId: user.$id });

      // Verify if it not exist or if have role 'MEMBER'
      if (!member || member.role === RoleEnum.MEMBER) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        if (image && image instanceof File) {
          const fileUploaded = await storage.createFile({
            bucketId: APPWRITE_STORAGE_ID,
            fileId: ID.unique(),
            file: image,
          });

          imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!}/storage/buckets/${APPWRITE_STORAGE_ID}/files/${fileUploaded.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!}`;
        } else {
          imageUrl = image;
        }

        const workspace = await tablesDB.updateRow({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: "workspaces",
          rowId: workspaceId,
          data: {
            name,
            imageUrl,
          },
        });

        return c.json(
          {
            data: workspace,
          },
          200,
        );
      } catch (error) {
        console.log("UPDATE WORKSPACE ERROR: ", error);

        if (error instanceof AppwriteException) {
          return c.json({ error: error.message }, 400);
        }

        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  .delete("/:workspaceId", authMiddleware, async (c) => {
    // DELETE WORKSPACE
    const workspaceId = c.req.param("workspaceId");

    const tablesDB = c.get("tablesDB");
    const user = c.get("user");

    // Get the member of workspace
    const member = await getMember({ workspaceId, userId: user.$id });

    // Verify if it not exist or if have role 'MEMBER'
    if (!member || member.role === RoleEnum.MEMBER) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      await tablesDB.deleteRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "workspaces",
        rowId: workspaceId,
      });

      return c.json(
        {
          data: workspaceId,
        },
        200,
      );
    } catch (error) {
      console.log("DELETE WORKSPACE ERROR: ", error);

      if (error instanceof AppwriteException) {
        return c.json({ error: error.message }, 400);
      }

      return c.json({ error: "Internal Server Error" }, 500);
    }
  })
  .post("/:workspaceId/reset-invite-code", authMiddleware, async (c) => {
    // RESET INVITE CODE
    const workspaceId = c.req.param("workspaceId");

    const tablesDB = c.get("tablesDB");
    const user = c.get("user");

    // Get the member of workspace
    const member = await getMember({ workspaceId, userId: user.$id });

    // Verify if it not exist or if have role 'MEMBER'
    if (!member || member.role === RoleEnum.MEMBER) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const workspace = await tablesDB.updateRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "workspaces",
        rowId: workspaceId,
        data: {
          inviteCode: generateInviteCode(8),
        },
      });

      return c.json(
        {
          data: workspace,
        },
        200,
      );
    } catch (error) {
      console.log("RESET INVITE CODE WORKSPACE ERROR: ", error);

      if (error instanceof AppwriteException) {
        return c.json({ error: error.message }, 400);
      }

      return c.json({ error: "Internal Server Error" }, 500);
    }
  })
  .post(
    "/:workspaceId/join",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        code: z.string(),
      }),
    ),
    async (c) => {
      // JOIN WORKSPACE
      const workspaceId = c.req.param("workspaceId");
      const { code } = c.req.valid("json");

      const tablesDB = c.get("tablesDB");
      const user = c.get("user");

      // Get the member of workspace
      const member = await getMember({ workspaceId, userId: user.$id });

      if (member) {
        return c.json({ error: "Already a member" }, 400);
      }

      const workspace = await tablesDB.getRow<Workspace>({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "workspaces",
        rowId: workspaceId,
      });

      if (workspace.inviteCode !== code) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      try {
        const workspace = await tablesDB.createRow({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: "workspace-members",
          rowId: ID.unique(),
          data: {
            memberId: user.$id,
            role: RoleEnum.MEMBER,
            workspaceId: workspaceId,
          },
        });

        return c.json(
          {
            data: workspace,
          },
          200,
        );
      } catch (error) {
        console.log("JOIN WORKSPACE ERROR: ", error);

        if (error instanceof AppwriteException) {
          return c.json({ error: error.message }, 400);
        }

        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  );

export default store;
