import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";

const DashboardLoading = () => {
  return (
    <main className="flex min-h-svh w-full bg-muted items-center justify-center p-6 md:p-10">
      <div className="flex items-center justify-center text-primary gap-4">
        <CircleNotchIcon weight="bold" className="size-10 animate-spin" />
        <span className="text-xl font-bold truncate select-none">Loading</span>
      </div>
    </main>
  );
};

export { DashboardLoading };
