"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/user-button";
import { useCurrentPicture } from "@/features/auth/hooks/use-current-picture";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import Image from "next/image";
import { redirect } from "next/navigation";

const WorkspacePage = () => {
  const { data: response } = useCurrentUser();
  const { mutate } = useLogout();

  if (!response) redirect("/sign-in");

  const pictureUrl =
    process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT! +
    `/avatars/initials?name=${response.data.name.split(" ").splice(0, 2).join("+")}&width=100&height=100`;

  return (
    <div>
      <h1>This page is protected</h1>
      <p>{response.data.email}</p>
      <p>{response.data.name}</p>
      <UserButton />
    </div>
  );
};

export default WorkspacePage;
