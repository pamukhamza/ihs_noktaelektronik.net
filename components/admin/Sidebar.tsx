import Link from "next/link"

export function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
      <div className="text-xl font-bold mb-8">Admin Panel</div>
      
      <nav className="space-y-2">
        <Link 
          href="/admin"
          className="block px-4 py-2 rounded hover:bg-gray-700"
        >
          Dashboard
        </Link>
        <Link 
          href="/admin/products"
          className="block px-4 py-2 rounded hover:bg-gray-700"
        >
          Ürünler
        </Link>
      </nav>
    </div>
  )
}