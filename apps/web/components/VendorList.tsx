"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import VendorForm from "./VendorForm";
import { vendorsApi } from "@/lib/api";

interface Vendor {
  id: string;
  name: string;
  phones: string[];
  specialties: string[];
  hours: string;
  priority: number;
  notes: string;
  category?: string;
  rating?: number;
  status?: "active" | "inactive";
  address?: string;
  spendingLimit?: number;
  totalSpent?: number;
  jobHistory?: JobHistory[];
  lastUsed?: string;
}

interface JobHistory {
  id: string;
  vendorId: string;
  ticketId: string;
  propertyId: string;
  jobType: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  completedAt?: string;
  notes?: string;
}

export default function VendorList() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorsApi.getAll();
      setVendors(data);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
      setError("Failed to load vendors. Please try again.");
      // Fallback to mock data for development
      setVendors([
        {
          id: "v_1",
          name: "Acme Plumbing",
          phones: ["+1 (555) 123-4567", "+1 (555) 123-4568"],
          specialties: ["plumbing"],
          hours: "24/7 Emergency Service",
          priority: 1,
          notes: "prefers SMS, fastest response time",
          category: "plumbing",
          rating: 4.8,
          status: "active",
          address: "123 Main St, City, State",
          spendingLimit: 2000,
          totalSpent: 1250,
          lastUsed: "2024-01-15",
          jobHistory: [
            {
              id: "job_1",
              vendorId: "v_1",
              ticketId: "t_1",
              propertyId: "prop_1",
              jobType: "Sink Repair",
              amount: 350,
              status: "completed",
              completedAt: "2024-01-15T14:30:00Z",
              notes: "Fixed leaky faucet and replaced gasket"
            },
            {
              id: "job_2",
              vendorId: "v_1",
              ticketId: "t_2",
              propertyId: "prop_2",
              jobType: "Pipe Replacement",
              amount: 900,
              status: "completed",
              completedAt: "2024-01-10T10:15:00Z",
              notes: "Replaced corroded pipe under kitchen sink"
            }
          ]
        },
        {
          id: "v_2",
          name: "Quick Fix Electric",
          phones: ["+1 (555) 987-6543"],
          specialties: ["electrical"],
          hours: "Mon-Fri 8AM-6PM",
          priority: 2,
          notes: "licensed electrician, good for emergencies",
          category: "electrical",
          rating: 4.6,
          status: "active",
          address: "456 Electric Ave, City, State",
          spendingLimit: 1500,
          totalSpent: 800,
          lastUsed: "2024-01-12",
          jobHistory: [
            {
              id: "job_3",
              vendorId: "v_2",
              ticketId: "t_3",
              propertyId: "prop_1",
              jobType: "Outlet Repair",
              amount: 200,
              status: "completed",
              completedAt: "2024-01-12T16:45:00Z",
              notes: "Fixed loose outlet in kitchen"
            },
            {
              id: "job_4",
              vendorId: "v_2",
              ticketId: "t_4",
              propertyId: "prop_3",
              jobType: "Light Fixture Installation",
              amount: 600,
              status: "completed",
              completedAt: "2024-01-08T11:20:00Z",
              notes: "Installed new ceiling fan in living room"
            }
          ]
        },
        {
          id: "v_3",
          name: "Cool Air HVAC",
          phones: ["+1 (555) 456-7890"],
          specialties: ["repairs", "maintenance", "installation"],
          hours: "24/7 Emergency Service",
          priority: 1,
          notes: "best for HVAC emergencies",
          category: "hvac",
          rating: 4.9,
          status: "active",
          address: "789 HVAC Blvd, City, State"
        },
        {
          id: "v_4",
          name: "Handyman Pro",
          phones: ["+1 (555) 321-0987"],
          specialties: ["repairs", "maintenance", "painting"],
          hours: "Mon-Sat 7AM-7PM",
          priority: 3,
          notes: "general repairs, not available weekends",
          category: "general",
          rating: 4.4,
          status: "inactive",
          address: "321 Fix It Lane, City, State"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      try {
        await vendorsApi.delete(id);
        setVendors(vendors.filter((v) => v.id !== id));
      } catch (err) {
        console.error("Failed to delete vendor:", err);
        alert("Failed to delete vendor. Please try again.");
      }
    }
  };

  const handleSave = async (vendorData: Omit<Vendor, 'id'>) => {
    try {
      if (editingVendor) {
        // Update existing vendor
        await vendorsApi.update(editingVendor.id, vendorData);
        setVendors(vendors.map(v => v.id === editingVendor.id ? { ...v, ...vendorData } : v));
      } else {
        // Create new vendor
        try {
          const newVendor = await vendorsApi.create(vendorData);
          setVendors([...vendors, newVendor]);
        } catch (apiError) {
          // If API fails, create a mock vendor for development
          console.warn("API create failed, using mock data:", apiError);
          const mockVendor: Vendor = {
            id: `v_${Date.now()}`, // Generate unique ID
            ...vendorData,
            rating: 0,
            status: "active" as const,
            address: ""
          };
          setVendors([...vendors, mockVendor]);
        }
      }
      setShowForm(false);
      setEditingVendor(null);
    } catch (err) {
      console.error("Failed to save vendor:", err);
      alert("Failed to save vendor. Please try again.");
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = searchTerm === "" || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = filterSpecialty === "all" || 
      vendor.specialties?.some(s => s.toLowerCase() === filterSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading vendors...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchVendors}
            className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Service Vendors</h2>
          <button
            onClick={() => {
              setEditingVendor(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Vendor</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border text-gray-900 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors w-64"
          />
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="px-4 py-2 border text-gray-900 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="all">All Specialties</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="hvac">HVAC</option>
            <option value="lock">Lock</option>
          </select>
          <button 
            onClick={fetchVendors}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {showForm && (
        <VendorForm
          vendor={editingVendor}
          onClose={() => {
            setShowForm(false);
            setEditingVendor(null);
          }}
          onSave={handleSave}
        />
      )}

      <div className="divide-y">
        {filteredVendors.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            {searchTerm ? "No vendors match your search" : "No vendors found"}
          </div>
        ) : (
          filteredVendors.map((vendor, index) => (
            <motion.div 
              key={vendor.id} 
              className="p-6 hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                    {vendor.status && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vendor.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {vendor.status}
                      </span>
                    )}
                    {vendor.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600">{vendor.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{vendor.phones?.join(", ") || "No phone numbers"}</span>
                    </div>
                    {vendor.address && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{vendor.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {vendor.specialties?.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {specialty}
                      </span>
                    )) || <span className="text-gray-500 text-sm">No specialties listed</span>}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>⏰ {vendor.hours}</span>
                    <span>🎯 Priority: {vendor.priority}</span>
                    {vendor.category && (
                      <span className="capitalize">📂 {vendor.category}</span>
                    )}
                  </div>

                  {/* Spending Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        ${vendor.totalSpent || 0}
                      </div>
                      <div className="text-xs text-gray-600">Total Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        ${vendor.spendingLimit || 0}
                      </div>
                      <div className="text-xs text-gray-600">Monthly Limit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {vendor.jobHistory?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Jobs Completed</div>
                    </div>
                  </div>

                  {/* Job History */}
                  {vendor.jobHistory && vendor.jobHistory.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Recent Jobs:</h4>
                      <div className="space-y-2">
                        {vendor.jobHistory.slice(0, 3).map((job) => (
                          <div key={job.id} className="bg-white p-2 rounded border text-xs">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-medium text-gray-800">{job.jobType}</span>
                                <div className="text-gray-600">${job.amount}</div>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${
                                job.status === 'completed' ? 'bg-green-100 text-green-800' :
                                job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {job.status}
                              </span>
                            </div>
                            {job.completedAt && (
                              <div className="text-gray-500 mt-1">
                                {new Date(job.completedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ))}
                        {vendor.jobHistory.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{vendor.jobHistory.length - 3} more jobs
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {vendor.notes && (
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                      <span className="font-medium">Notes:</span> {vendor.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingVendor(vendor);
                      setShowForm(true);
                    }}
                    className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vendor.id)}
                    className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium hover:bg-red-50 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

