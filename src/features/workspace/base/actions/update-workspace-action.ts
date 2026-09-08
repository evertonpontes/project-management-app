"use server";

import { authClient } from "@/lib/safe-action";
import { updateWorkspaceSchema } from "../schemas";

function generateCode() {
  return Math.round(Math.random() * (99999 - 10000) + 10000);
}

export const updateWorkspace = authClient
  .inputSchema(updateWorkspaceSchema)
  .action(async ({ ctx, parsedInput }) => {
    const supabase = ctx.supabase;
    const user = ctx.user;

    const { name, description, image, workspaceId } = parsedInput;

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
        "User does not have permission to update this workspace.",
      );
    }

    let imageUploadUrl: string | null = null;

    if (image && image instanceof File) {
      const fileExt = image.name.split(".").pop();
      const filePath = `${user.sub}-${generateCode()}.${fileExt}`;

      const { error, data } = await supabase.storage
        .from("workspace-images")
        .upload(filePath, image);

      if (error) {
        throw error;
      }

      imageUploadUrl = data.fullPath;
    }

    const { error, success, data } = await supabase
      .from("workspaces")
      .update({
        name,
        description,
        image_url: imageUploadUrl,
      })
      .eq("id", workspaceId)
      .select("id, name")
      .single();

    if (error) {
      throw error;
    }

    return { success, data };
  });
