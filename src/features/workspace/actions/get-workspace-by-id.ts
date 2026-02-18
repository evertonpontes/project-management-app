import { createSessionClient } from "@/lib/server/appwrite";
import { APPWRITE_DATABASE_ID } from "../constants";
import { Workspace } from "../types";
import { Models } from "node-appwrite";

interface GetWorkspaceByIdProps {
  workspaceId: string;
}

const getWorkspaceById = async ({
  workspaceId,
}: GetWorkspaceByIdProps): Promise<{ data: Workspace | null }> => {
  try {
    const { tablesDB } = await createSessionClient();

    const workspace = await tablesDB.getRow<Workspace>({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "workspaces",
      rowId: workspaceId,
    });

    return { data: JSON.parse(JSON.stringify(workspace)) };
  } catch (error) {
    return { data: null };
  }
};

export { getWorkspaceById };
