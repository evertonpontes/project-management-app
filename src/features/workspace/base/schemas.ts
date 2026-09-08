import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3, "Workspace name must be at least 3 characters long."),
  description: z.string().optional(),
  image: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .transform((value) =>
      typeof value === "string" && value === "" ? undefined : value,
    ),
});

export const updateWorkspaceSchema = z.object({
  workspaceId: z.uuid("Invalid workspace ID."),
  name: z
    .string()
    .min(3, "Workspace name must be at least 3 characters long.")
    .optional(),
  description: z.string().optional(),
  image: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .transform((value) =>
      typeof value === "string" && value === "" ? undefined : value,
    ),
});
