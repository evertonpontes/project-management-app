import {
  type TablesDB,
  type Account,
  Models,
  type Storage,
} from "node-appwrite";

import { createMiddleware } from "hono/factory";

import { createSessionClient } from "./server/appwrite";

type ResponseType = {
  Variables: {
    account: Account;
    tablesDB: TablesDB;
    user: Models.User;
    storage: Storage;
  };
};

const authMiddleware = createMiddleware<ResponseType>(async (c, next) => {
  try {
    const { account, tablesDB, storage } = await createSessionClient();

    const user = await account.get();

    c.set("account", account);
    c.set("tablesDB", tablesDB);
    c.set("user", user);
    c.set("storage", storage);

    await next();
  } catch (error) {
    return c.json("Unauthorized", 401);
  }
});

export { authMiddleware };
