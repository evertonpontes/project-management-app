import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4 text-foreground bg-background">
      <div className="flex items-center justify-center gap-2">
        <Button
          nativeButton={false}
          render={<Link href={"/login"}>Login</Link>}
          className="px-4"
        />
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href={"/sign-up"}>Get Started</Link>}
          className="px-4"
        />
      </div>
    </div>
  );
}
