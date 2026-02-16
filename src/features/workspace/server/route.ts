import { AppwriteException, ID, Query } from "node-appwrite";

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { createWorkspaceSchema } from "../schemas";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { authMiddleware } from "@/lib/auth-middleware";
import { APPWRITE_DATABASE_ID, APPWRITE_STORAGE_ID } from "../constants";

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

          imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!}/storage/buckets/${APPWRITE_STORAGE_ID}/files/${fileUploaded.$id}/views?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!}`;
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

    try {
      const workspaces = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "workspaces",
        queries: [Query.orderDesc("$createdAt")],
      });

      return c.json({ data: workspaces }, 200);
    } catch (error) {
      console.log("GET WORKSPACES ERROR: ", error);

      return c.json({ data: null }, 500);
    }
  });

export default store;
