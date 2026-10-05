import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8" aria-busy="true">
      <div className="mb-8 border-2 border-ink bg-band-bg p-6 pb-0 text-band-text">
        <Skeleton className="h-12 w-64 bg-band-text/20" />
        <Skeleton className="mt-4 h-5 w-full max-w-xl bg-band-text/20" />
        <div className="mt-8 grid grid-cols-1 gap-6 pb-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border-2 border-ink bg-paper p-5 shadow">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-5 h-12 w-20" />
            </div>
          ))}
        </div>
        <div className="-mx-6 h-10 azulejo" aria-hidden="true" />
      </div>
      <div className="border-2 border-ink bg-paper p-6 shadow">
        <Skeleton className="h-6 w-72" />
        <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
        <Skeleton className="mt-6 h-11 w-44" />
      </div>
    </div>
  );
}

export function RequestsListSkeleton() {
  return (
    <div className="p-8" aria-busy="true">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-11 w-44" />
      </div>
      <div className="border-2 border-ink bg-paper shadow">
        <div className="grid grid-cols-6 gap-4 border-b-2 border-ink bg-ink p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-4 bg-paper/25" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, row) => (
          <div key={row} className="grid grid-cols-6 gap-4 border-b-2 border-ink p-4 last:border-b-0">
            {Array.from({ length: 6 }).map((__, col) => (
              <Skeleton key={col} className="h-5" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RequestDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-4xl p-8" aria-busy="true">
      <Skeleton className="mb-6 h-5 w-40" />
      <div className="border-2 border-ink bg-paper p-8 shadow">
        <div className="mb-6 border-b-2 border-ink pb-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-9 w-full max-w-xl" />
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-3 h-28 w-full" />
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </div>
    </div>
  );
}

export function RequestFormSkeleton() {
  return (
    <div className="mx-auto max-w-2xl p-8" aria-busy="true">
      <Skeleton className="mb-8 h-10 w-72" />
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-11 w-36" />
      </div>
    </div>
  );
}

export function BrandbookSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8" aria-busy="true">
      <div className="mb-8 border-2 border-ink bg-band-bg p-6 pb-0">
        <Skeleton className="h-14 w-80 bg-band-text/20" />
        <Skeleton className="mt-5 h-5 w-full max-w-2xl bg-band-text/20" />
        <div className="azulejo mt-8 h-10" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="border-2 border-ink bg-paper shadow-sm">
            <Skeleton className="h-16 rounded-none" />
            <div className="p-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-2 h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RouteSkeleton() {
  return <DashboardSkeleton />;
}
