export default function WidgetSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
      
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}