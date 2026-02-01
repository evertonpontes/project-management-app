import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center gap-2 min-h-svh w-full justify-center">
      <Button render={<Link href="/sign-in" />} nativeButton={false}>
        Login
      </Button>
      <Button
        variant="outline"
        render={<Link href="/sign-up" />}
        nativeButton={false}
      >
        Sign Up
      </Button>
    </div>
  );
}
