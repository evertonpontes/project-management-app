import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";

import { loginSchema, registerSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { COOKIES_SESSION_NAME } from "../constants";
import { authMiddleware } from "@/lib/auth-middleware";
import { errorApi } from "@/lib/error-api";

const app = new Hono()
  .get("/current", authMiddleware, async (c) => {
    const user = c.get("user");

    return c.json({ success: true, data: user });
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

      return c.json({ success: true, message: "Login successful" }, 200);
    } catch (error: unknown) {
      const errorParse = errorApi.safeParse(error);

      if (errorParse.success) {
        return c.json(
          { success: false, message: errorParse.data.message },
          errorParse.data.code,
        );
      }

      console.log("SIGN IN ERROR", error);

      return c.json({ success: false, message: "Something went wrong" }, 500);
    }
  })
  .post("/sign-up", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

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

    return c.json(
      { success: true, message: "Account created successfully" },
      201,
    );
  })
  .post("/sign-out", authMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, COOKIES_SESSION_NAME);

    await account.deleteSession({ sessionId: "current" });

    return c.json({ success: true, message: "Logout successful" }, 200);
  });

export default app;
