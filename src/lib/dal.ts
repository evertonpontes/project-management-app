import "server-only";

import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { COOKIES_SESSION_NAME } from "@/features/auth/constants";
import { redirect } from "next/navigation";

export const verifySession = async () => {
  const session = (await cookies()).get(COOKIES_SESSION_NAME);

  if (!session || !session.value) {
    redirect("/sign-in");
  }

  return session.value;
};

export const getUser = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    const session = await verifySession();

    if (!session) {
      return null;
    }

    client.setSession(session);

    const account = new Account(client);
    const user = await account.get();

    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch {
    return null;
  }
};
