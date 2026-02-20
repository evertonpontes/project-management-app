import { createSessionClient } from "@/lib/server/appwrite";
import { APPWRITE_DATABASE_ID } from "../constants";
import { Workspace } from "../types";
import { Models } from "node-appwrite";

interface GetWorkspaceInfoProps {
  workspaceId: string;
}

const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceInfoProps) => {
  try {
    const { tablesDB } = await createSessionClient();

    const workspace = await tablesDB.getRow<Workspace>({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "workspaces",
      rowId: workspaceId,
    });

    return { data: { workspaceName: workspace.name } };
  } catch (error) {
    return { data: null };
  }
};

export { getWorkspaceInfo };
