"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useJoinWorkspace } from "../api/use-join-workspace";

interface JoiWorkspaceFormProps {
  workspaceName: string;
  workspaceId: string;
  code: string;
}

const JoinWorkspaceForm = ({
  workspaceName,
  workspaceId,
  code,
}: JoiWorkspaceFormProps) => {
  const router = useRouter();

  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = async () => {
    mutate({
      json: { code },
      param: { workspaceId },
    });
  };

  return (
    <Card className="py-0 shadow-xs">
      <CardContent className="px-0">
        <CardHeader className="p-8">
          <CardTitle className="text-xl">
            Join workspace <b>{workspaceName}</b>
          </CardTitle>
          <CardDescription>
            You've been invited to join this workspace. Click the button bellow
            to begin.
          </CardDescription>
        </CardHeader>

        <Separator className="w-full h-px" />

        <div className="flex items-center justify-between flex-col lg:flex-row gap-2 p-8 bg-muted">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/workspaces")}
            className="w-full lg:w-fit"
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onSubmit}
            className="w-full lg:w-fit"
            disabled={isPending}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { JoinWorkspaceForm };
