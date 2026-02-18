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

const editWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Name is required").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;

type EditWorkspaceFormData = z.infer<typeof editWorkspaceSchema>;

export {
  createWorkspaceSchema,
  editWorkspaceSchema,
  type CreateWorkspaceFormData,
  type EditWorkspaceFormData,
};
