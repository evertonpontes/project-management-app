import { type Account as AccountType } from "node-appwrite";

import { createMiddleware } from "hono/factory";

import { createSessionClient } from "./server/appwrite";

type ResponseType = {
  Variables: {
    account: AccountType;
  };
};

const authMiddleware = createMiddleware<ResponseType>(async (c, next) => {
  try {
    const { account } = await createSessionClient();

    c.set("account", account);

    await next();
  } catch (error) {
    c.json("Unauthorized", 401);
  }
});

export { authMiddleware };
