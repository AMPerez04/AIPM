"use client";

import { useState, useEffect } from "react";

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
      });
    }
  }, [vendor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add validation
    onSave(formData);
  };

  return (
    <div className="p-6 border-b bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">
        {vendor ? "Edit Vendor" : "Add Vendor"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-4 py-2 border rounded-lg mb-2"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialties
          </label>
          {formData.specialties.map((specialty, index) => (
            <input
              key={index}
              type="text"
              value={specialty}
              onChange={(e) => {
                const newSpecialties = [...formData.specialties];
                newSpecialties[index] = e.target.value;
                setFormData({ ...formData, specialties: newSpecialties });
              }}
              className="w-full px-4 py-2 border rounded-lg mb-2"
              placeholder="plumbing"
            />
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hours
          </label>
          <input
            type="text"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="9-6"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <input
            type="number"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: parseInt(e.target.value) })
            }
            className="w-full px-4 py-2 border rounded-lg"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
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

