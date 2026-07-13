import { ProjectCardSkeleton } from "@/components/ui/Skeleton";

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
        </div>

        {/* Search & Filters Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        {/* Project Grid Skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
