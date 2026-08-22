import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  email: z.email().min(1, "Email is required."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export const loginSchema = z.object({
  email: z.email().min(1, "Email is required."),
  password: z.string().min(1, "Password is required."),
});
