"use client";

import { Spinner } from "./ui/spinner";

const DashboardLoading = () => {
  return (
    <main className="flex min-h-svh h-full items-center justify-center w-full p-6 md:p-8 bg-muted">
      <Spinner className="size-10 fill-indigo-500" />
    </main>
  );
};

export { DashboardLoading };
