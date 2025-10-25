"use client";

import Link from "next/link";

interface HeaderProps {
  showDashboardLink?: boolean;
  showHomeLink?: boolean;
  blueBackground?: boolean;
}

export default function Header({ showDashboardLink = false, showHomeLink = false, blueBackground = false }: HeaderProps) {
  return (
    <header className={`${blueBackground ? 'bg-[#6366F1]' : 'bg-white'} shadow-sm border-b`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/home" className="flex items-center space-x-3 ">
            <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
            {blueBackground ? (
              <span className="text-white">Properly</span>
            ) : (
              <span className="text-[#EC4899] ">
                Properly
                </span>
            )}
            </h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            {showHomeLink && (
              <Link 
                href="/home"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Home
              </Link>
            )}
            {showDashboardLink && (
              <Link 
                href="/"
                className="bg-[#6366F1] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </Link>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className={`text-sm ${blueBackground ? 'text-blue-200' : 'text-gray-600'}`}>AI Agent Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

