"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "../schemas";

export const login = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  });
