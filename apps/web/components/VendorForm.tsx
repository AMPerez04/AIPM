"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

// TODO: Implement form validation
// TODO: Validate phone numbers
// TODO: Handle save via POST /vendors or PUT /vendors/:id
// TODO: Add error handling
// TODO: Add success notifications

interface Vendor {
  id: string;
  name: string;
  phones: string[];
  specialties: string[];
  hours: string;
  priority: number;
  notes: string;
}

interface VendorFormProps {
  vendor: Vendor | null;
  onClose: () => void;
  onSave: (vendor: Omit<Vendor, "id">) => void;
}

export default function VendorForm({ vendor, onClose, onSave }: VendorFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phones: [""],
    specialties: [""],
    hours: "",
    priority: 1,
    notes: "",
    spendingLimit: 0,
    rating: 0,
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name,
        phones: vendor.phones,
        specialties: vendor.specialties,
        hours: vendor.hours,
        priority: vendor.priority,
        notes: vendor.notes,
        spendingLimit: (vendor as any).spendingLimit || 0,
        rating: (vendor as any).rating || 0,
      });
    }
  }, [vendor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add validation
    
    // Filter out empty values from arrays
    const cleanedData = {
      ...formData,
      phones: formData.phones.filter(phone => phone.trim() !== ""),
      specialties: formData.specialties.filter(specialty => specialty.trim() !== "")
    };
    
    onSave(cleanedData);
  };

  return (
    <motion.div 
      className="p-6 border-b bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h3 
        className="text-lg font-semibold mb-4 text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {vendor ? "Edit Vendor" : "Add Vendor"}
      </motion.h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Phone Numbers
          </label>
          {formData.phones.map((phone, index) => (
            <input
              key={index}
              type="tel"
              value={phone}
              onChange={(e) => {
                const newPhones = [...formData.phones];
                newPhones[index] = e.target.value;
                setFormData({ ...formData, phones: newPhones });
              }}
               className="w-full px-4 py-2 border rounded-lg mb-2 text-gray-900"
              placeholder="+15551234567"
            />
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, phones: [...formData.phones, ""] })
            }
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Phone
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Specialties
          </label>
          {formData.specialties.map((specialty, index) => (
            <select
              key={index}
              value={specialty}
              onChange={(e) => {
                const newSpecialties = [...formData.specialties];
                newSpecialties[index] = e.target.value;
                setFormData({ ...formData, specialties: newSpecialties });
              }}
              className="w-full px-4 py-2 border rounded-lg mb-2 text-gray-900"
            >
              <option value="">Select a specialty...</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="hvac">HVAC</option>
              <option value="lock">Lock</option>
            </select>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                specialties: [...formData.specialties, ""],
              })
            }
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Specialty
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Hours
          </label>
          <input
            type="text"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg text-gray-900"
            placeholder="9-6"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Priority
            </label>
            <input
              type="number"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Rating (1-5)
            </label>
            <input
              type="number"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              min="1"
              max="5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Monthly Spending Limit ($)
          </label>
          <input
            type="number"
            value={formData.spendingLimit}
            onChange={(e) =>
              setFormData({ ...formData, spendingLimit: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border rounded-lg text-gray-900"
            min="0"
            placeholder="0 for no limit"
          />
          <p className="text-xs text-gray-600 mt-1">
            Set a monthly spending limit for this vendor. Leave as 0 for no limit.
          </p>
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
          />
        </div>

        <motion.div 
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            type="submit"
            className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save
          </motion.button>
          <motion.button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}

