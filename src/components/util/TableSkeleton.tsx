const TableSkeleton = () => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {/* Table Header Skeleton */}
      <div className="h-10 bg-slate-200 rounded-lg w-full"></div>

      {/* Repeatable Rows */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-2">
          <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div className="h-8 w-20 bg-slate-100 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
