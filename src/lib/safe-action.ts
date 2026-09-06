import { createSafeActionClient } from "next-safe-action";
import { createClient } from "./supabase/server";

export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    // When an action throws an unexpected error
    console.error("Action error: ", e.message);

    return e.message;
  },
});

export const authClient = actionClient.use(async ({ next, ctx }) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Not Authorized");
  }

  const user = data.claims;

  return next({ ctx: { supabase, user } });
});
