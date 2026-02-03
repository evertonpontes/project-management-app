"use client";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { redirect } from "next/navigation";

const WorkspacePage = () => {
  const { data: response } = useCurrentUser();
  const { mutate } = useLogout();

  if (!response) redirect("/sign-in");

  return (
    <div>
      <h1>This page is protected</h1>
      <p>{response.data.email}</p>
      <p>{response.data.name}</p>
      <Button onClick={() => mutate()}>Logout</Button>
    </div>
  );
};

export default WorkspacePage;
