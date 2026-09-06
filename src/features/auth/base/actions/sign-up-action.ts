"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import { signUpSchema } from "../schemas";

export const signUp = actionClient.inputSchema(signUpSchema).action(async ({ parsedInput }) => {
  const { name, email, password } = parsedInput;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    throw error;
  }

  return true;
});
