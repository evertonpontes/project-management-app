import { betterAuth } from "@next-safe-action/adapter-better-auth";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "./auth";

export const actionClient = createSafeActionClient({
    handleServerError: (e) => {
        console.log(e.message);
        return {
            message: e.message,
        };
    }
});

export const authClient = actionClient.use(betterAuth(auth))