"use client";

import { useState, useEffect } from "react";
import { CallLog, Property, Vendor } from "@/types";

interface CallLogFormProps {
  callLog: CallLog | null;
  onClose: () => void;
  onSave: (callLog: Omit<CallLog, "id" | "createdAt" | "updatedAt">) => void;
  properties: Property[];
  vendors: Vendor[];
}

export default function CallLogForm({ callLog, onClose, onSave, properties, vendors }: CallLogFormProps) {
  const [formData, setFormData] = useState({
    callSid: "",
    propertyId: "",
    vendorId: "",
    tenantId: "",
    callType: "inbound" as "inbound" | "outbound",
    callStatus: "completed" as "completed" | "missed" | "voicemail" | "busy" | "failed",
    duration: 0,
    recordingUrl: "",
    transcription: "",
    summary: "",
    notes: "",
  });

  useEffect(() => {
    if (callLog) {
      setFormData({
        callSid: callLog.callSid,
        propertyId: callLog.propertyId,
        vendorId: callLog.vendorId || "",
        tenantId: callLog.tenantId || "",
        callType: callLog.callType,
        callStatus: callLog.callStatus,
        duration: callLog.duration,
        recordingUrl: callLog.recordingUrl || "",
        transcription: callLog.transcription || "",
        summary: callLog.summary || "",
        notes: callLog.notes || "",
      });
    }
  }, [callLog]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up empty values
    const cleanedData = {
      ...formData,
      vendorId: formData.vendorId.trim() || undefined,
      tenantId: formData.tenantId.trim() || undefined,
      recordingUrl: formData.recordingUrl.trim() || undefined,
      transcription: formData.transcription.trim() || undefined,
      summary: formData.summary.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    };
    
    onSave(cleanedData);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const parseDuration = (timeString: string) => {
    const [mins, secs] = timeString.split(':').map(Number);
    return (mins * 60) + (secs || 0);
  };

  return (
    <div className="p-6 border-b bg-gray-50">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        {callLog ? "Edit Call Log" : "Add Call Log"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Call SID *
            </label>
            <input
              type="text"
              value={formData.callSid}
              onChange={(e) => setFormData({ ...formData, callSid: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              placeholder="CA1234567890abcdef"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Property *
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              required
            >
              <option value="">Select a property...</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.address}{property.unit && `, ${property.unit}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Vendor
            </label>
            <select
              value={formData.vendorId}
              onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
            >
              <option value="">Select a vendor...</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Call Type *
            </label>
            <select
              value={formData.callType}
              onChange={(e) => setFormData({ ...formData, callType: e.target.value as "inbound" | "outbound" })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              required
            >
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Call Status *
            </label>
            <select
              value={formData.callStatus}
              onChange={(e) => setFormData({ ...formData, callStatus: e.target.value as "completed" | "missed" | "voicemail" | "busy" | "failed" })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              required
            >
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="voicemail">Voicemail</option>
              <option value="busy">Busy</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Duration (mm:ss)
            </label>
            <input
              type="text"
              value={formatDuration(formData.duration)}
              onChange={(e) => setFormData({ ...formData, duration: parseDuration(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg text-gray-900"
              placeholder="5:30"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Recording URL
          </label>
          <input
            type="url"
            value={formData.recordingUrl}
            onChange={(e) => setFormData({ ...formData, recordingUrl: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg text-gray-900"
            placeholder="https://api.twilio.com/2010-04-01/Accounts/.../Recordings/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Transcription
          </label>
          <textarea
            value={formData.transcription}
            onChange={(e) => setFormData({ ...formData, transcription: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg text-gray-900"
            rows={4}
            placeholder="Full transcription of the call..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Summary
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg text-gray-900"
            rows={3}
            placeholder="Brief summary of the call..."
          />
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
            placeholder="Additional notes about the call..."
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
