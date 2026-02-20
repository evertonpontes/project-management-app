import { AppwriteException, ID, Query } from "node-appwrite";

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { createWorkspaceSchema, editWorkspaceSchema } from "../schemas";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { authMiddleware } from "@/lib/auth-middleware";
import { APPWRITE_DATABASE_ID, APPWRITE_STORAGE_ID } from "../constants";
import { generateInviteCode } from "@/lib/utils";
import { RoleEnum } from "@/features/member/types";
import { getMember } from "@/features/member/queries/get-member";

const store = new Hono()
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    authMiddleware,
    async (c) => {
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

        await tablesDB.createRow({
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
            message: "Workspace created successfully",
          },
          201,
        );
      } catch (error) {
        console.log("CREATE WORKSPACE ERROR: ", error);

        if (error instanceof AppwriteException) {
          const statusCode = error.code;

          return c.json(
            { message: error.message },
            statusCode as ContentfulStatusCode,
          );
        }

        return c.json({ message: "Internal Server Error" }, 500);
      }
    },
  )
  .get("/", authMiddleware, async (c) => {
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

      return c.json({ data: null }, 500);
    }
  })
  .patch(
    "/:workspaceId",
    zValidator("form", editWorkspaceSchema),
    authMiddleware,
    async (c) => {
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
        return c.json({ message: "Unauthorized" }, 401);
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

        await tablesDB.updateRow({
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
            message: "Workspace updated successfully",
          },
          200,
        );
      } catch (error) {
        console.log("UPDATE WORKSPACE ERROR: ", error);

        if (error instanceof AppwriteException) {
          const statusCode = error.code;

          return c.json(
            { message: error.message },
            statusCode as ContentfulStatusCode,
          );
        }

        return c.json({ message: "Internal Server Error" }, 500);
      }
    },
  )
  .delete("/:workspaceId", authMiddleware, async (c) => {
    const workspaceId = c.req.param("workspaceId");

    const tablesDB = c.get("tablesDB");
    const user = c.get("user");

    // Get the member of workspace
    const member = await getMember({ workspaceId, userId: user.$id });

    // Verify if it not exist or if have role 'MEMBER'
    if (!member || member.role === RoleEnum.MEMBER) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    try {
      await tablesDB.deleteRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "workspaces",
        rowId: workspaceId,
      });

      return c.json(
        {
          message: "Workspace deleted successfully",
        },
        200,
      );
    } catch (error) {
      console.log("DELETE WORKSPACE ERROR: ", error);

      if (error instanceof AppwriteException) {
        const statusCode = error.code;

        return c.json(
          { message: error.message },
          statusCode as ContentfulStatusCode,
        );
      }

      return c.json({ message: "Internal Server Error" }, 500);
    }
  })
  .post("/:workspaceId/reset-invite-code", authMiddleware, async (c) => {
    const workspaceId = c.req.param("workspaceId");

    const tablesDB = c.get("tablesDB");
    const user = c.get("user");

    // Get the member of workspace
    const member = await getMember({ workspaceId, userId: user.$id });

    // Verify if it not exist or if have role 'MEMBER'
    if (!member || member.role === RoleEnum.MEMBER) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    try {
      await tablesDB.updateRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "workspaces",
        rowId: workspaceId,
        data: {
          inviteCode: generateInviteCode(8),
        },
      });

      return c.json(
        {
          message: "Workspace invite code updated successfully",
        },
        200,
      );
    } catch (error) {
      console.log("RESET INVITE CODE WORKSPACE ERROR: ", error);

      if (error instanceof AppwriteException) {
        const statusCode = error.code;

        return c.json(
          { message: error.message },
          statusCode as ContentfulStatusCode,
        );
      }

      return c.json({ message: "Internal Server Error" }, 500);
    }
  });

export default store;
