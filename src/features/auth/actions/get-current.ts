"use server";

import { createSessionClient } from "@/lib/server/appwrite";

const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
};

export { getLoggedInUser };
