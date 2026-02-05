"use server";

import { COOKIES_SESSION_NAME } from "@/features/auth/constants";
import { cookies } from "next/headers";
import { Client, TablesDB } from "node-appwrite";

const getAllWorkspaces = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const cookieStores = await cookies();

  const session = cookieStores.get(COOKIES_SESSION_NAME);

  if (!session || !session.value) {
    return null;
  }

  client.setSession(session.value);

  const tables = new TablesDB(client);

  const workspaces = await tables.listRows({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    tableId: "workspaces",
    total: true,
  });

  return { data: JSON.parse(JSON.stringify(workspaces)) };
};

export { getAllWorkspaces };
