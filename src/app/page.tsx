import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8">Cazno</h1>
        <Link 
          href="/login" 
          className="bg-black text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-800 transition-colors"
        >
          SIGN IN
        </Link>
      </div>
    </div>
  )
}