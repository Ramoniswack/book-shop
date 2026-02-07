export default function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="bg-gray-200 p-3 rounded-lg w-12 h-12"></div>
      </div>
    </div>
  );
}
