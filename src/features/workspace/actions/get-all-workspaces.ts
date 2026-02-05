"use server";

import { COOKIES_SESSION_NAME } from "@/features/auth/constants";
import { cookies } from "next/headers";
import { Account, Client, Query, TablesDB } from "node-appwrite";

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

  const account = new Account(client);

  const user = await account.get();

  const workspaceMember = await tables.listRows({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    tableId: "workspace-member",
    queries: [Query.equal("memberId", [user.$id])],
  });

  const workspacesId: string[] = workspaceMember.rows.map(
    (workspace) => workspace.workspaceId,
  );

  const workspaces = await tables.listRows({
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    tableId: "workspaces",
    total: true,
    queries: [Query.equal("$id", workspacesId)],
  });

  return { data: JSON.parse(JSON.stringify(workspaces)) };
};

export { getAllWorkspaces };
