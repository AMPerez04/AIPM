"use client";

import { useState, useEffect } from "react";
import { Property, PropertyRule } from "@/types";

interface PropertyFormProps {
  property: Property | null;
  onClose: () => void;
  onSave: (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => void;
}

export default function PropertyForm({ property, onClose, onSave }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    address: "",
    unit: "",
    propertyType: "apartment" as "apartment" | "house" | "condo" | "townhouse",
    bedrooms: 0,
    bathrooms: 0,
    squareFootage: 0,
    rent: 0,
    status: "active" as "active" | "inactive" | "maintenance",
    notes: "",
    tenantId: "",
  });

  const [rules, setRules] = useState<PropertyRule[]>([]);
  const [newRule, setNewRule] = useState({
    ruleType: "spending_limit" as "spending_limit" | "approval_required" | "vendor_restriction" | "time_restriction",
    description: "",
    value: 0,
    isActive: true,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        address: property.address,
        unit: property.unit || "",
        propertyType: property.propertyType,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        squareFootage: property.squareFootage || 0,
        rent: property.rent || 0,
        status: property.status,
        notes: property.notes || "",
        tenantId: property.tenantId || "",
      });
      setRules(property.rules || []);
    }
  }, [property]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up empty values
    const cleanedData = {
      ...formData,
      unit: formData.unit.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      tenantId: formData.tenantId.trim() || undefined,
      rules: rules,
    };
    
    onSave(cleanedData);
  };

  return (
    <div className="p-6 border-b bg-gray-50">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        {property ? "Edit Property" : "Add Property"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              placeholder="123 Main Street"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Unit
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              placeholder="Apt 2B"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Property Type *
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as "apartment" | "house" | "condo" | "townhouse" })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              required
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" | "maintenance" })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Bedrooms
            </label>
            <input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Bathrooms
            </label>
            <input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              min="0"
              step="0.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Square Footage
            </label>
            <input
              type="number"
              value={formData.squareFootage}
              onChange={(e) => setFormData({ ...formData, squareFootage: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Monthly Rent ($)
            </label>
            <input
              type="number"
              value={formData.rent}
              onChange={(e) => setFormData({ ...formData, rent: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Tenant ID
            </label>
            <input
              type="text"
              value={formData.tenantId}
              onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              placeholder="ten_123"
            />
          </div>
        </div>


        <div className="border-t pt-4">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Property Rules</h4>
          
          {/* Existing Rules */}
          {rules.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-800 mb-2">Current Rules:</h5>
              {rules.map((rule, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-800">
                        {rule.ruleType.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                      {rule.value && (
                        <p className="text-xs text-gray-500">Limit: ${rule.value}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => setRules(rules.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Rule */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-800 mb-3">Add New Rule:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Rule Type
                </label>
                <select
                  value={newRule.ruleType}
                  onChange={(e) => setNewRule({ ...newRule, ruleType: e.target.value as "spending_limit" | "approval_required" | "vendor_restriction" | "time_restriction" })}
                  className="w-full px-4 py-2 border rounded-lg text-gray-900"
                >
                  <option value="spending_limit">Spending Limit</option>
                  <option value="approval_required">Approval Required</option>
                  <option value="vendor_restriction">Vendor Restriction</option>
                  <option value="time_restriction">Time Restriction</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Value (for limits)
                </label>
                <input
                  type="number"
                  value={newRule.value}
                  onChange={(e) => setNewRule({ ...newRule, value: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg text-gray-900"
                  placeholder="500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg text-gray-900"
                placeholder="e.g., Do not approve any repairs over $500 without manual confirmation"
              />
            </div>
            <div className="mt-4 flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newRule.isActive}
                  onChange={(e) => setNewRule({ ...newRule, isActive: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-800">Active</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  if (newRule.description.trim()) {
                    const rule: PropertyRule = {
                      id: `rule_${Date.now()}`,
                      propertyId: property?.id || '',
                      ...newRule,
                      createdAt: new Date().toISOString(),
                    };
                    setRules([...rules, rule]);
                    setNewRule({
                      ruleType: "spending_limit" as "spending_limit" | "approval_required" | "vendor_restriction" | "time_restriction",
                      description: "",
                      value: 0,
                      isActive: true,
                    });
                  }
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg text-gray-900"
            rows={3}
            placeholder="Additional property notes..."
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
