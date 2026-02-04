"use server";

import {
  Account,
  Client,
  Models,
  Avatars,
  type Account as AccountType,
  type Avatars as AvatarsType,
} from "node-appwrite";
import { createMiddleware } from "hono/factory";
import { cookies } from "next/headers";
import { COOKIES_SESSION_NAME } from "@/features/auth/constants";

type ResponseType = {
  Variables: {
    account: AccountType;
    user: Models.User<Models.Preferences>;
    avatars: AvatarsType;
  };
};

const authMiddleware = createMiddleware<ResponseType>(async (c, next) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const cookieStores = cookies();

  const session = (await cookieStores).get(COOKIES_SESSION_NAME);

  if (!session || !session.value) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  client.setSession(session.value);

  const account = new Account(client);
  const avatars = new Avatars(client);
  const user = await account.get();

  c.set("account", account);
  c.set("user", user);
  c.set("avatars", avatars);

  return next();
});

export { authMiddleware };
