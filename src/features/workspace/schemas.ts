import z from "zod";

const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;

export { createWorkspaceSchema, type CreateWorkspaceFormData };
