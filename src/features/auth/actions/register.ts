"use server";

import z from "zod";
import { signUpSchema } from "../schemas";

type ErrorsField = {
  errors?: string[];
};

type Errors = {
  name?: ErrorsField;
  email?: ErrorsField;
  password?: ErrorsField;
  confirmPassword?: ErrorsField;
};

type FormState = {
  errors?: Errors;
  message?: string;
};

export async function register(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const data = Object.fromEntries(formData);

  const validatedFields = signUpSchema.safeParse(data);

  if (validatedFields.error) {
    const errors = z.treeifyError(validatedFields.error).properties;

    return {
      errors,
    };
  }

  return {
    message: "Account created successfully",
  };
}
