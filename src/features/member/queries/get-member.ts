import { APPWRITE_DATABASE_ID } from "@/features/workspace/constants";
import { createSessionClient } from "@/lib/server/appwrite";
import { Query } from "node-appwrite";

interface GetMemberProps {
  workspaceId: string;
  userId: string;
}

const getMember = async ({ workspaceId, userId }: GetMemberProps) => {
  try {
    const { tablesDB } = await createSessionClient();

    const member = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: "workspace-members",
      queries: [
        Query.equal("workspaceId", workspaceId),
        Query.equal("memberId", userId),
      ],
    });

    return member.rows[0];
  } catch (error) {
    return null;
  }
};

export { getMember };
