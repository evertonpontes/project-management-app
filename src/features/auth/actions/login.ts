"use server";

import z from "zod";
import { loginSchema } from "../schemas";

type ErrorsField = {
  errors?: string[];
};

type Errors = {
  email?: ErrorsField;
  password?: ErrorsField;
};

type FormState = {
  errors?: Errors;
  message?: string;
};

export async function login(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const data = Object.fromEntries(formData);

  const validatedFields = loginSchema.safeParse(data);

  if (validatedFields.error) {
    const errors = z.treeifyError(validatedFields.error).properties;

    return {
      errors,
    };
  }

  return {
    message: "Login successful",
  };
}
