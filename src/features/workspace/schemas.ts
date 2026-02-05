import { z } from "zod";

const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  file: z
    .union([
      z.string().transform((value) => (value === "" ? undefined : value)),
      z.instanceof(File),
    ])
    .optional(),
});

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;

export { createWorkspaceSchema, type CreateWorkspaceFormData };
