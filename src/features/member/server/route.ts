import z from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authMiddleware } from "@/lib/auth-middleware";
import { getMember } from "../queries/get-member";
import { APPWRITE_DATABASE_ID } from "@/features/workspace/constants";
import { Query } from "node-appwrite";
import { createAdminClient } from "@/lib/server/appwrite";
import { RoleEnum } from "../types";

const app = new Hono()
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
      const { users } = await createAdminClient();
      const tablesDB = c.get("tablesDB");
      const user = c.get("user");

      const { workspaceId } = c.req.valid("query");

      const member = getMember({ workspaceId, userId: user.$id });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const members = await tablesDB.listRows({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: "members",
          queries: [Query.equal("workspaceId", workspaceId)],
        });

        const populatedMembers = await Promise.all(
          members.rows.map(async (member) => {
            const user = await users.get({ userId: member.memberId });

            return {
              ...member,
              name: user.name,
              email: user.email,
            };
          }),
        );

        return c.json(
          {
            data: {
              ...members,
              documents: populatedMembers,
            },
          },
          200,
        );
      } catch (error) {
        console.log("FETCH WORKSPACE MEMBERS ERROR: ", error);

        return c.json({ error: "Internal server error" }, 500);
      }
    },
  )
  .delete("/:memberId", authMiddleware, async (c) => {
    const memberId = c.req.param("memberId");
    const user = c.get("user");
    const tablesDB = c.get("tablesDB");

    try {
      const memberToUpdate = await tablesDB.getRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "members",
        rowId: memberId,
      });

      const allMembersInWorkspace = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "members",
        queries: [Query.equal("workspaceId", memberToUpdate.workspaceId)],
      });

      const member = await getMember({
        userId: user.$id,
        workspaceId: memberToUpdate.workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (member.$id !== memberToUpdate.$id && member.role !== RoleEnum.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (allMembersInWorkspace.total === 1) {
        return c.json({ error: "Cannot delete the only member" }, 400);
      }

      await tablesDB.deleteRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: "members",
        rowId: memberId,
      });

      return c.json({ data: { $id: member.$id } }, 200);
    } catch (error) {
      console.log("DELETE WORKSPACE MEMBER ERROR: ", error);

      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .patch(
    "/:memberId",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        role: z.enum(RoleEnum),
      }),
    ),
    async (c) => {
      const { role } = c.req.valid("json");
      const memberId = c.req.param("memberId");
      const user = c.get("user");
      const tablesDB = c.get("tablesDB");

      try {
        const memberToUpdate = await tablesDB.getRow({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: "members",
          rowId: memberId,
        });

        const allMembersInWorkspace = await tablesDB.listRows({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: "members",
          queries: [Query.equal("workspaceId", memberToUpdate.workspaceId)],
        });

        const member = await getMember({
          userId: user.$id,
          workspaceId: memberToUpdate.workspaceId,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        if (member.role !== RoleEnum.ADMIN) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        if (allMembersInWorkspace.total === 1) {
          return c.json({ error: "Cannot downgrade the only member" }, 400);
        }

        await tablesDB.updateRow({
          databaseId: APPWRITE_DATABASE_ID,
          tableId: "members",
          rowId: memberId,
          data: {
            role,
          },
        });

        return c.json({ data: { $id: member.$id } }, 200);
      } catch (error) {
        console.log("UPDATE WORKSPACE MEMBER ERROR: ", error);

        return c.json({ error: "Internal server error" }, 500);
      }
    },
  );

export default app;
