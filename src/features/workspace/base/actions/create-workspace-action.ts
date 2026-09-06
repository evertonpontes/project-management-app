"use server";

import { authClient } from "@/lib/safe-action";
import { createWorkspaceSchema } from "../schemas";

function generateCode() {
  return Math.round(Math.random() * (99999 - 10000) + 10000);
}

export const createWorkspace = authClient
  .inputSchema(createWorkspaceSchema)
  .action(async ({ ctx, parsedInput }) => {
    const supabase = ctx.supabase;
    const user = ctx.user;

    const { name, description, image } = parsedInput;

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
      .insert({
        name,
        description,
        image_url: imageUploadUrl,
        owner_id: user.sub,
      })
      .select("id, name")
      .single();

    if (error) {
      throw error;
    }

    return { success, data };
  });
