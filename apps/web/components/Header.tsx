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
          <Link href="/home" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 bg-gradient-to-br from-[#EC4899] to-[#6366F1] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="flex items-baseline space-x-2">
              <h1 className="text-3xl font-black tracking-tight">
                {blueBackground ? (
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">ProperlyAI</span>
                ) : (
                  <span className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] bg-clip-text text-transparent">ProperlyAI</span>
                )}
              </h1>
        
            </div>
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

