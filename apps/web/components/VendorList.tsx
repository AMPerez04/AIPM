"use client";

import { useState, useEffect } from "react";
import VendorForm from "./VendorForm";

// TODO: Fetch vendors via GET /vendors
// TODO: Implement vendor CRUD operations
// TODO: Display vendor specialties
// TODO: Show vendor priority
// TODO: Add notes field
// TODO: Validate phone numbers
// TODO: Handle loading and error states

interface Vendor {
  id: string;
  name: string;
  phones: string[];
  specialties: string[];
  hours: string;
  priority: number;
  notes: string;
}

export default function VendorList() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // TODO: Implement fetchVendors function
  useEffect(() => {
    // Simulated data for now
    setTimeout(() => {
      setVendors([
        {
          id: "v_1",
          name: "Acme Plumbing",
          phones: ["+15551234567"],
          specialties: ["plumbing"],
          hours: "9-6",
          priority: 1,
          notes: "prefers SMS",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // TODO: Implement deleteVendor function
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter((v) => v.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Loading vendors...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Vendors</h2>
        <button
          onClick={() => {
            setEditingVendor(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Vendor
        </button>
      </div>

      {showForm && (
        <VendorForm
          vendor={editingVendor}
          onClose={() => {
            setShowForm(false);
            setEditingVendor(null);
          }}
          onSave={(vendor) => {
            // TODO: Implement save logic
            console.log("Save vendor:", vendor);
            setShowForm(false);
          }}
        />
      )}

      <div className="divide-y">
        {vendors.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No vendors found
          </div>
        ) : (
          vendors.map((vendor) => (
            <div key={vendor.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{vendor.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {vendor.phones.join(", ")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {vendor.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Hours: {vendor.hours} | Priority: {vendor.priority}
                  </p>
                  {vendor.notes && (
                    <p className="text-sm text-gray-600 mt-1">
                      Notes: {vendor.notes}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingVendor(vendor);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vendor.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

