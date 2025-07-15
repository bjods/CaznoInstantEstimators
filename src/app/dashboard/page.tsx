export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Widgets</h3>
          <p className="text-gray-600">Manage your estimate widgets</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Estimates</h3>
          <p className="text-gray-600">View submitted estimates</p>
        </div>
      </div>
    </div>
  )
}