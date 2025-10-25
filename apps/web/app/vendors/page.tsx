"use client";

import VendorList from "@/components/VendorList";
import Header from "@/components/Header";

// TODO: Create vendors page layout
// TODO: Add navigation back to dashboard
// TODO: Add page title and description

export default function VendorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600 mt-2">
            Manage your vendor list and their specialties
          </p>
        </div>

        <VendorList />
      </main>
    </div>
  );
}

