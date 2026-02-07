"use server";

import {
  Account,
  Client,
  Models,
  TablesDB,
  Storage,
  type Account as AccountType,
  type TablesDB as TablesDBType,
  type Storage as StorageType,
} from "node-appwrite";
import { createMiddleware } from "hono/factory";
import { cookies } from "next/headers";
import { COOKIES_SESSION_NAME } from "@/features/auth/constants";

type ResponseType = {
  Variables: {
    account: AccountType;
    user: Models.User<Models.Preferences>;
    tables: TablesDBType;
    storage: StorageType;
  };
};

const authMiddleware = createMiddleware<ResponseType>(async (c, next) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    const cookieStores = cookies();

    const session = (await cookieStores).get(COOKIES_SESSION_NAME);

    if (!session || !session.value) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    client.setSession(session.value);

    const account = new Account(client);
    const tables = new TablesDB(client);
    const storage = new Storage(client);
    const user = await account.get();

    c.set("account", account);
    c.set("tables", tables);
    c.set("storage", storage);
    c.set("user", user);

    return next();
  } catch {
    return c.json({ message: "Unauthorized" }, 401);
  }
});

export { authMiddleware };
