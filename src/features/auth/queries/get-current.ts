"use server";

import { createSessionClient } from "@/lib/server/appwrite";
import { Models } from "node-appwrite";

const getLoggedInUser = async (): Promise<{ data: Models.User | null }> => {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    return { data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    return { data: null };
  }
};

export { getLoggedInUser };
