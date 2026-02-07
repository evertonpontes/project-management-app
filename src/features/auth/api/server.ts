import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { AppwriteException, ID } from "node-appwrite";

import { loginSchema, registerSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { COOKIES_SESSION_NAME } from "../constants";
import { authMiddleware } from "@/lib/auth-middleware";

const app = new Hono()
  .get("/current", authMiddleware, async (c) => {
    const user = c.get("user");

    return c.json({ data: user }, 200);
  })
  .post("/sign-in", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    try {
      const { account } = await createAdminClient();

      const session = await account.createEmailPasswordSession({
        email,
        password,
      });

      setCookie(c, COOKIES_SESSION_NAME, session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ message: "Login successful" }, 200);
    } catch (error) {
      console.log("SIGN-IN ERROR: ", error);

      if (error instanceof AppwriteException) {
        if (error.type === "user_invalid_credentials") {
          return c.json({ message: error.message }, 401);
        }
      }

      return c.json({ message: "Something went wrong" }, 500);
    }
  })
  .post("/sign-up", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    try {
      const { account } = await createAdminClient();

      await account.create({
        userId: ID.unique(),
        email,
        password,
        name,
      });

      const session = await account.createEmailPasswordSession({
        email,
        password,
      });

      setCookie(c, COOKIES_SESSION_NAME, session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ message: "Account created successfully" }, 201);
    } catch (error) {
      console.log("SIGN-UP ERROR: ", error);

      if (error instanceof AppwriteException) {
        if (error.type === "user_already_exists") {
          return c.json({ message: "Email already in use" }, 409);
        }
      }

      return c.json({ message: "Something went wrong" }, 500);
    }
  })
  .post("/sign-out", authMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, COOKIES_SESSION_NAME);

    await account.deleteSession({ sessionId: "current" });

    return c.json({ message: "Logout successful" }, 200);
  });

export default app;
