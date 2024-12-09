import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white shadow-md h-screen fixed left-0">
        <div className="p-6">
          <div className="text-xl font-bold text-gray-800 mb-8">Admin Panel</div>
          <nav className="flex flex-col space-y-4">
            <a href="/admin" className="text-gray-600 hover:text-gray-900 py-2">Dashboard</a>
            <a href="/admin/products" className="text-gray-600 hover:text-gray-900 py-2">Products</a>
            <a href="/admin/slider" className="text-gray-600 hover:text-gray-900 py-2">Slider</a>
          </nav>
        </div>
      </aside>
      <div className="flex-1 ml-64">
        {/* Admin Header */}
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-end">
              <button className="text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
