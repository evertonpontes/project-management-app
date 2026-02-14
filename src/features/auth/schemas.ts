import z from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((fields) => fields.password === fields.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export { loginSchema, signUpSchema, type LoginFormData, type SignUpFormData };
