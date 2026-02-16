import { AppwriteException, ID } from "node-appwrite";

import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";

import { createAdminClient } from "@/lib/server/appwrite";

import { loginSchema, signUpSchema } from "../schemas";
import { COOKIE_AUTH_SESSION } from "../config";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { authMiddleware } from "@/lib/auth-middleware";

const auth = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const { account } = await createAdminClient();

    try {
      const session = await account.createEmailPasswordSession({
        email,
        password,
      });

      setCookie(c, COOKIE_AUTH_SESSION, session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
      });

      return c.json(
        {
          message: "Login successful",
        },
        200,
      );
    } catch (error) {
      console.log("LOGIN ERROR: ", error);

      if (error instanceof AppwriteException) {
        const statusCode = error.code;

        return c.json(
          { message: error.message },
          statusCode as ContentfulStatusCode,
        );
      }

      return c.json({ message: "Internal Server Error" }, 500);
    }
  })
  .post("/sign-up", zValidator("json", signUpSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    const { account } = await createAdminClient();

    try {
      await account.create({
        userId: ID.unique(),
        name,
        email,
        password,
      });

      const session = await account.createEmailPasswordSession({
        email,
        password,
      });

      setCookie(c, COOKIE_AUTH_SESSION, session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
      });

      return c.json(
        {
          message: "Sign up successful",
        },
        201,
      );
    } catch (error) {
      console.log("SIGN UP ERROR: ", error);

      if (error instanceof AppwriteException) {
        const statusCode = error.code;

        return c.json(
          { message: error.message },
          statusCode as ContentfulStatusCode,
        );
      }

      return c.json({ message: "Internal Server Error" }, 500);
    }
  })
  .post("/sign-out", authMiddleware, async (c) => {
    try {
      const account = c.get("account");

      deleteCookie(c, COOKIE_AUTH_SESSION);

      await account.deleteSession({ sessionId: "current" });

      return c.json({ message: "Logout successful" });
    } catch (error) {
      console.log("SIGN OUT ERROR: ", error);

      if (error instanceof AppwriteException) {
        const statusCode = error.code;

        return c.json(
          { message: error.message },
          statusCode as ContentfulStatusCode,
        );
      }

      return c.json({ message: "Internal Server Error" }, 500);
    }
  })
  .get("/current", authMiddleware, async (c) => {
    try {
      const account = c.get("account");

      const user = await account.get();

      return c.json({ data: user });
    } catch (error) {
      console.log("CURRENT ERROR: ", error);

      return c.json({ data: null }, 500);
    }
  });

export default auth;
