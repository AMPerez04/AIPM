"use client";

// TODO: Add navigation/routing
// TODO: Add logo/branding
// TODO: Add user menu/logout
// TODO: Mobile responsive hamburger menu

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          
          {/* TODO: Add navigation menu */}
          <nav className="hidden md:flex space-x-4">
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-md hover:bg-blue-50 transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
              Tickets
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
              Vendors
            </a>
          </nav>

          {/* TODO: Add user menu */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
              Profile
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

