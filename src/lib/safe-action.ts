import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    // When an action throws an unexpected error
    console.error("Action error: ", e.message);

    return e.message;
  },
});
