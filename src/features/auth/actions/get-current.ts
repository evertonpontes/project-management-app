"use server";

import { createSessionClient } from "@/lib/server/appwrite";

const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    return { data: user };
  } catch (error) {
    return { data: null };
  }
};

export { getLoggedInUser };
