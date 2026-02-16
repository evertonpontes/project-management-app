import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/user-button";

export default async function Home() {
  return (
    <div className="flex min-h-svh w-full bg-muted items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Button
          size="lg"
          render={<Link href="/login">Login</Link>}
          nativeButton={false}
        />
        <Button
          size="lg"
          variant="secondary"
          render={<Link href="/sign-up">Sign Up</Link>}
          nativeButton={false}
        />
        <UserButton />
      </div>
    </div>
  );
}
