import { ID, Query } from "node-appwrite";
import z from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "@/lib/auth-middleware";
import { APPWRITE_DATABASE_ID } from "@/features/workspace/constants";
import { getMember } from "@/features/member/queries/get-member";
import { RoleEnum } from "@/features/member/types";
import {
  createCustomTaskFieldSchema,
  updateCustomTaskFieldSchema,
} from "../schemas";

const app = new Hono();

export default app
  .post(
    "/",
    authMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      }),
    ),
    zValidator("json", createCustomTaskFieldSchema),
    async (c) => {
      const { workspaceId } = c.req.valid("query");
      const data = c.req.valid("json");

      const tablesDB = c.get("tablesDB");
      const user = c.get("user");

      try {
        const member = await getMember({ userId: user.$id, workspaceId });

        if (!member || member.role !== RoleEnum.ADMIN) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const customTaskField = await tablesDB.createRow({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: "custom-task-fields",
          rowId: ID.unique(),
          data: {
            ...data,
            createdBy: user.$id,
            updatedBy: user.$id,
          },
        });

        return c.json({ data: customTaskField }, 201);
      } catch (error) {
        console.log("CREATE CUSTOM TASK FIELD ERROR: ", error);

        return c.json({ error: "Error creating custom task field" }, 500);
      }
    },
  )
  .get(
    "/",
    authMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      }),
    ),
    async (c) => {
      const { workspaceId } = c.req.valid("query");

      const tablesDB = c.get("tablesDB");
      const user = c.get("user");

      try {
        const member = await getMember({ userId: user.$id, workspaceId });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const customTaskField = await tablesDB.listRows({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: "custom-task-fields",
          queries: [Query.equal("workspaceId", workspaceId)],
        });

        return c.json({ data: customTaskField }, 200);
      } catch (error) {
        console.log("FETCH CUSTOM TASK FIELD ERROR: ", error);

        return c.json({ error: "Error fetching custom task field" }, 500);
      }
    },
  )
  .patch(
    "/:customTaskFieldId",
    authMiddleware,
    zValidator("json", updateCustomTaskFieldSchema),
    async (c) => {
      const customTaskFieldId = c.req.param("customTaskFieldId");
      const data = c.req.valid("json");

      const tablesDB = c.get("tablesDB");
      const user = c.get("user");

      try {
        const customTaskFieldToUpdate = await tablesDB.getRow({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: "custom-task-fields",
          rowId: customTaskFieldId,
        });

        const member = await getMember({
          userId: user.$id,
          workspaceId: customTaskFieldToUpdate.workspaceId,
        });

        if (!member || member.role !== RoleEnum.ADMIN) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const customTaskField = await tablesDB.updateRow({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: "custom-task-fields",
          rowId: customTaskFieldId,
          data: {
            ...data,
            updatedBy: user.$id,
          },
        });

        return c.json({ data: customTaskField }, 200);
      } catch (error) {
        console.log("UPDATE CUSTOM TASK FIELD ERROR: ", error);

        return c.json({ error: "Error creating custom task field" }, 500);
      }
    },
  )
  .delete("/:customTaskFieldId", authMiddleware, async (c) => {
    const customTaskFieldId = c.req.param("customTaskFieldId");

    const tablesDB = c.get("tablesDB");
    const user = c.get("user");

    try {
      const customTaskFieldToUpdate = await tablesDB.getRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "custom-task-fields",
        rowId: customTaskFieldId,
      });

      const member = await getMember({
        userId: user.$id,
        workspaceId: customTaskFieldToUpdate.workspaceId,
      });

      if (!member || member.role !== RoleEnum.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await tablesDB.deleteRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "custom-task-fields",
        rowId: customTaskFieldId,
      });

      return c.json({ data: { $id: customTaskFieldId } }, 200);
    } catch (error) {
      console.log("DELETE CUSTOM TASK FIELD ERROR: ", error);

      return c.json({ error: "Error creating custom task field" }, 500);
    }
  });
