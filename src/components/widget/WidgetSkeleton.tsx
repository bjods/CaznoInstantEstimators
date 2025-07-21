export default function WidgetSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-pulse">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Step Title Skeleton */}
          <div className="h-10 bg-gray-200 rounded w-96 mx-auto mb-8" />

          {/* Components Skeleton */}
          <div className="space-y-8 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48" />
                <div className="h-12 bg-gray-200 rounded" />
                {i === 2 && (
                  <div className="h-96 bg-gray-200 rounded" /> // Map component placeholder
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="bg-white border-t border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="h-12 bg-gray-200 rounded w-24" />
          <div className="h-12 bg-gray-200 rounded w-32" />
        </div>
      </footer>
    </div>
  )
}