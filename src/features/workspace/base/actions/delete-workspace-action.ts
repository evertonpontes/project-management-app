"use server";

import { authClient } from "@/lib/safe-action";
import z from "zod";

export const deleteWorkspace = authClient
  .inputSchema(z.object({ workspaceId: z.uuid() }))
  .action(async ({ ctx, parsedInput }) => {
    const supabase = ctx.supabase;
    const user = ctx.user;

    const { workspaceId } = parsedInput;

    const { data: workspaceMemberData, error: workspaceMemberError } =
      await supabase
        .from("workspace_members")
        .select("id")
        .eq("workspace_id", workspaceId)
        .eq("user_id", user.sub)
        .eq("role", "admin")
        .single();

    if (workspaceMemberError) {
      throw workspaceMemberError;
    }

    if (!workspaceMemberData) {
      throw new Error(
        "User does not have permission to delete this workspace.",
      );
    }

    const { error, success, data } = await supabase
      .from("workspaces")
      .delete()
      .eq("id", workspaceId)
      .select("id, name")
      .single();

    if (error) {
      throw error;
    }

    return { success, data };
  });
