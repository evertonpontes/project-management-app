"use server";

import { Query } from "node-appwrite";
import { createSessionClient } from "@/lib/server/appwrite";
import { APPWRITE_DATABASE_ID } from "../constants";

const getWorkspaces = async () => {
  try {
    const { tablesDB } = await createSessionClient();
    const workspaces = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "workspaces",
      queries: [Query.orderDesc("$createdAt")],
    });

    return { data: workspaces };
  } catch (error) {
    return { data: null };
  }
};

export { getWorkspaces };
