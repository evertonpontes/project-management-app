"use server";

import z from "zod";

import { client } from "@/lib/client";

import { signUpSchema } from "../schemas";
import { toast } from "sonner";

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

  const response = await client.api.auth["sign-up"].$post({
    json: validatedFields.data,
  });

  if (!response.ok) {
    //toast.error("Failed to create account. Please try again.");

    return {
      message: "Failed to create account. Please try again.",
    };
  }

  //toast.success("Account created successfully");

  return {
    message: "Account created successfully",
  };
}
