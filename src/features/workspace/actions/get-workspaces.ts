"use server";

import { Models, Query } from "node-appwrite";
import { createSessionClient } from "@/lib/server/appwrite";
import { APPWRITE_DATABASE_ID } from "../constants";

const getWorkspaces = async (): Promise<{ data: Models.RowList | null }> => {
  try {
    const { tablesDB } = await createSessionClient();
    const workspaces = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "workspaces",
      queries: [Query.orderDesc("$createdAt")],
    });

    return { data: JSON.parse(JSON.stringify(workspaces)) };
  } catch (error) {
    return { data: null };
  }
};

export { getWorkspaces };
