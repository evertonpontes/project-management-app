import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex h-full flex-col gap-4 w-full p-6 md-10">
      <div className="w-full grid auto-rows-min gap-4 md:grid-cols-3">
        <Skeleton className="aspect-video" />
        <Skeleton className="aspect-video" />
        <Skeleton className="aspect-video" />
      </div>
      <Skeleton className="flex-1 w-full h-full" />
    </div>
  );
};

export default Loading;
