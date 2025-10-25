"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import PropertyForm from "./PropertyForm";
import { Property } from "@/types";
import { propertiesApi } from "@/lib/api";

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertiesApi.getAll();
      setProperties(data);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setError("Failed to load properties. Please try again.");
      // Fallback to mock data for development
      setProperties([
        {
          id: "prop_1",
          address: "123 Main Street",
          unit: "Apt 2B",
          propertyType: "apartment",
          bedrooms: 2,
          bathrooms: 1.5,
          squareFootage: 1200,
          rent: 2500,
          status: "active",
          notes: "Recently renovated kitchen",
          tenantId: "ten_1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          rules: [
            {
              id: "rule_1",
              propertyId: "prop_1",
              ruleType: "spending_limit",
              description: "Do not approve any repairs over $500 without manual confirmation",
              value: 500,
              isActive: true,
              createdAt: new Date().toISOString(),
            },
            {
              id: "rule_2",
              propertyId: "prop_1",
              ruleType: "approval_required",
              description: "All electrical work requires landlord approval",
              isActive: true,
              createdAt: new Date().toISOString(),
            }
          ],
          tenants: [
            {
              id: "ten_1",
              firstName: "John",
              lastName: "Smith",
              phone: "+1 (555) 123-4567",
              email: "john.smith@example.com",
              propertyId: "prop_1",
              leaseStart: "2024-01-01",
              leaseEnd: "2024-12-31",
              rent: 2500,
              status: "active",
            }
          ]
        },
        {
          id: "prop_2",
          address: "456 Oak Avenue",
          unit: "",
          propertyType: "house",
          bedrooms: 3,
          bathrooms: 2,
          squareFootage: 1800,
          rent: 3200,
          status: "active",
          notes: "Great for families",
          tenantId: "ten_2",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "prop_3",
          address: "789 Pine Road",
          unit: "Unit 5",
          propertyType: "condo",
          bedrooms: 1,
          bathrooms: 1,
          squareFootage: 800,
          rent: 1800,
          status: "maintenance",
          notes: "Under renovation",
          tenantId: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        await propertiesApi.delete(id);
        setProperties(properties.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Failed to delete property:", err);
        alert("Failed to delete property. Please try again.");
      }
    }
  };

  const handleSave = async (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingProperty) {
        // Update existing property
        await propertiesApi.update(editingProperty.id, propertyData);
        setProperties(properties.map(p => p.id === editingProperty.id ? { 
          ...p, 
          ...propertyData,
          updatedAt: new Date().toISOString()
        } : p));
      } else {
        // Create new property
        try {
          // For now, create a mock property since the API requires landlordId
          // TODO: Implement landlord creation or use a different endpoint
          console.warn("Property creation requires landlordId - using mock data for now");
          const mockProperty: Property = {
            id: `prop_${Date.now()}`,
            ...propertyData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setProperties([...properties, mockProperty]);
        } catch (apiError) {
          // If API fails, create a mock property for development
          console.warn("API create failed, using mock data:", apiError);
          const mockProperty: Property = {
            id: `prop_${Date.now()}`,
            ...propertyData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setProperties([...properties, mockProperty]);
        }
      }
      setShowForm(false);
      setEditingProperty(null);
    } catch (err) {
      console.error("Failed to save property:", err);
      alert("Failed to save property. Please try again.");
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchTerm === "" || 
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.unit && property.unit.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || property.status === filterStatus;
    const matchesType = filterType === "all" || property.propertyType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "apartment":
        return "🏢";
      case "house":
        return "🏠";
      case "condo":
        return "🏘️";
      case "townhouse":
        return "🏘️";
      default:
        return "🏠";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-800">Loading properties...</span>
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
            onClick={fetchProperties}
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
          <h2 className="text-xl font-semibold text-gray-900">Property Management</h2>
          <button
            onClick={() => {
              setEditingProperty(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Property</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border text-gray-900 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors w-64"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border text-gray-900 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border text-gray-900 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="all">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
          </select>
          <button 
            onClick={fetchProperties}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {showForm && (
        <PropertyForm
          property={editingProperty}
          onClose={() => {
            setShowForm(false);
            setEditingProperty(null);
          }}
          onSave={handleSave}
        />
      )}

      <div className="divide-y">
        {filteredProperties.length === 0 ? (
          <div className="p-6 text-center text-gray-800">
            {searchTerm ? "No properties match your search" : "No properties found"}
          </div>
        ) : (
          filteredProperties.map((property, index) => (
            <motion.div 
              key={property.id} 
              className="p-6 hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(property.propertyType)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {property.address}
                      {property.unit && `, ${property.unit}`}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-800">
                      <span className="font-medium">Type:</span>
                      <span className="capitalize">{property.propertyType}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-800">
                      <span className="font-medium">Bedrooms:</span>
                      <span>{property.bedrooms || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-800">
                      <span className="font-medium">Bathrooms:</span>
                      <span>{property.bathrooms || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-800">
                      <span className="font-medium">Rent:</span>
                      <span>{property.rent ? `$${property.rent.toLocaleString()}` : "N/A"}</span>
                    </div>
                  </div>

                  {property.squareFootage && (
                    <div className="text-sm text-gray-800 mb-2">
                      <span className="font-medium">Square Footage:</span> {property.squareFootage.toLocaleString()} sq ft
                    </div>
                  )}

                  {/* Property Rules */}
                  {property.rules && property.rules.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Property Rules:</h4>
                      <div className="space-y-2">
                        {property.rules.map((rule) => (
                          <div key={rule.id} className="bg-gray-50 p-2 rounded border-l-4 border-blue-400">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium text-gray-800">
                                  {rule.ruleType.replace('_', ' ').toUpperCase()}
                                </span>
                                <p className="text-xs text-gray-600">{rule.description}</p>
                                {rule.value && (
                                  <p className="text-xs text-gray-500">Limit: ${rule.value}</p>
                                )}
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${
                                rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {rule.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tenants */}
                  {property.tenants && property.tenants.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Current Tenants:</h4>
                      <div className="space-y-2">
                        {property.tenants.map((tenant) => (
                          <div key={tenant.id} className="bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium text-gray-800">
                                  {tenant.firstName} {tenant.lastName}
                                </span>
                                <div className="text-xs text-gray-600">
                                  {tenant.phone} • {tenant.email}
                                </div>
                                {tenant.leaseStart && tenant.leaseEnd && (
                                  <div className="text-xs text-gray-500">
                                    Lease: {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${
                                tenant.status === 'active' ? 'bg-green-100 text-green-800' :
                                tenant.status === 'inactive' ? 'bg-gray-100 text-gray-600' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {tenant.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {property.notes && (
                    <p className="text-sm text-gray-800 mt-2 bg-gray-50 p-2 rounded">
                      <span className="font-medium">Notes:</span> {property.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingProperty(property);
                      setShowForm(true);
                    }}
                    className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
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
