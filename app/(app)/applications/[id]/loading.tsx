import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-3 h-9 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />

      <Card className="mt-6 flex flex-col gap-5 p-6">
        <div className="flex items-center justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
        <div className="border-t border-border/60 pt-4">
          <Skeleton className="h-9 w-40" />
        </div>
      </Card>

      <div className="mt-8 flex flex-col gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="flex flex-col gap-4 p-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-40 w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}
