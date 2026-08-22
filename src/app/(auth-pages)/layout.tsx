import { cn } from "@/lib/utils";
import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDonutChartFill,
  RiFileCopyLine,
  RiLayoutLeftLine,
  RiLockFill,
  RiLogoutBoxLine,
  RiResetRightLine,
  RiShieldFill,
} from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex w-full flex-1">
      <div className="absolute inset-0 flex h-14 w-full items-center justify-center px-6 2xl:justify-start">
        <Link
          href="/"
          className="flex w-auto items-center gap-2 overflow-hidden"
        >
          <RiDonutChartFill className="text-primary size-8 md:size-6" />
          <span className="text-primary text-2xl font-bold tracking-tight md:text-lg">
            Workflow
          </span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
      <div className="hidden flex-1 basis-1/4 flex-col items-center justify-center gap-8 bg-linear-to-br from-blue-400 to-blue-600 p-6 2xl:flex">
        <div className="flex flex-col gap-1">
          <h1 className="text-foreground text-4xl font-semibold tracking-tight"></h1>
        </div>
        <BrowserMockup className="scale-95 select-none" />
      </div>
    </div>
  );
}

function BrowserMockup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-background flex h-[552px] w-4xl flex-col overflow-hidden rounded-2xl shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="border-border flex h-[38px] items-center justify-between gap-4 border-b px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-red-400" />
          <div className="size-2.5 rounded-full bg-yellow-400" />
          <div className="size-2.5 rounded-full bg-green-400" />
          <RiLayoutLeftLine className="text-muted-foreground ml-4 size-4" />
          <RiArrowLeftSLine className="text-muted-foreground size-4" />
          <RiArrowRightSLine className="text-muted-foreground size-4" />
        </div>

        <div className="flex max-w-sm flex-1 items-center gap-2">
          <RiShieldFill className="text-muted-foreground size-4" />
          <div className="bg-muted text-muted-foreground flex w-full max-w-sm items-center gap-2 rounded-md px-2 py-1">
            <div className="flex flex-1 items-center justify-center gap-1">
              <RiLockFill className="size-3" />
              <span className="text-xs tracking-tight">workflow.com</span>
            </div>
            <RiResetRightLine className="size-3" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RiLogoutBoxLine className="text-muted-foreground size-4" />
          <RiAddLine className="text-muted-foreground size-4" />
          <RiFileCopyLine className="text-muted-foreground size-4" />
        </div>
      </div>
      <div className="bg-background text-foreground relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4">
        <div className="absolute z-5 h-full w-full bg-linear-to-b from-black/50 to-transparent" />
        <Image
          src="/gradient.jpg"
          alt="background-gradient"
          fill
          className="absolute inset-0 brightness-80 contrast-80"
        />

        <h1 className="text-background z-10 text-center font-mono text-4xl leading-tight font-semibold tracking-tight">
          Project management
          <span className="block">your team will actually use 👏</span>
        </h1>
      </div>
    </div>
  );
}
