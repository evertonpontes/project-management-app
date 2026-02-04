import { z } from "zod";

const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;

export { createWorkspaceSchema, type CreateWorkspaceFormData };
