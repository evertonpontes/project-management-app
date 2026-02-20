"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

import { useJoinWorkspace } from "../hooks/use-join-workspace";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface JoiWorkspaceFormProps {
  workspaceName: string;
}

const JoinWorkspaceForm = ({ workspaceName }: JoiWorkspaceFormProps) => {
  const router = useRouter();
  const params = useParams<{ inviteCode: string; workspaceId: string }>();

  const { mutate, isPending } = useJoinWorkspace({
    workspaceId: params.workspaceId,
  });

  const onSubmit = async () => {
    mutate(
      {
        json: { code: params.inviteCode },
        param: { workspaceId: params.workspaceId },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${params.workspaceId}`);
        },
      },
    );
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
