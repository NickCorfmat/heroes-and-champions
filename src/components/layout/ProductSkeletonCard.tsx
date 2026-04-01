export function ProductSkeletonCard() {
    return (
      <div className="w-[170px] shrink-0 bg-white rounded-xs shadow animate-pulse">
        <div className="w-full h-64 bg-gray-300" />
        <div className="p-3 flex flex-col gap-2">
          <div className="h-3 bg-gray-300 rounded w-4/5" />
          <div className="h-3 bg-gray-300 rounded w-3/5" />
          <div className="h-5 bg-gray-300 rounded w-2/5 mt-1" />
        </div>
      </div>
    );
  }