"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import CallLogForm from "./CallLogForm";
import { CallLog, Property, Vendor } from "@/types";

export default function CallLogList() {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCallLog, setEditingCallLog] = useState<CallLog | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const fetchCallLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      // const data = await callLogsApi.getAll();
      // setCallLogs(data);
      
      // Mock data for development
      setCallLogs([
        {
          id: "call_1",
          callSid: "CA1234567890abcdef",
          propertyId: "prop_1",
          vendorId: "v_1",
          tenantId: "ten_1",
          callType: "inbound",
          callStatus: "completed",
          duration: 180, // 3 minutes
          recordingUrl: "https://api.twilio.com/2010-04-01/Accounts/.../Recordings/RE1234567890abcdef",
          transcription: "Hello, this is John from Acme Plumbing. I received your message about the leak under the sink. I can come by today between 1-5pm. Is that okay?",
          summary: "Vendor confirmed availability for today 1-5pm for sink leak repair",
          notes: "Tenant was very responsive and confirmed the time slot",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          property: {
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
          },
          vendor: {
            id: "v_1",
            name: "Acme Plumbing",
            phones: ["+1 (555) 123-4567", "+1 (555) 123-4568"],
            specialties: ["plumbing"],
            hours: "24/7 Emergency Service",
            priority: 1,
            notes: "prefers SMS, fastest response time",
          },
          tenant: {
            id: "ten_1",
            firstName: "John",
            lastName: "Smith",
            phone: "+1 (555) 987-6543",
          },
        },
        {
          id: "call_2",
          callSid: "CA0987654321fedcba",
          propertyId: "prop_2",
          vendorId: "v_2",
          callType: "outbound",
          callStatus: "missed",
          duration: 0,
          transcription: "",
          summary: "Attempted to contact Quick Fix Electric for electrical issue",
          notes: "No answer, left voicemail",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          property: {
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
          vendor: {
            id: "v_2",
            name: "Quick Fix Electric",
            phones: ["+1 (555) 987-6543"],
            specialties: ["electrical"],
            hours: "Mon-Fri 8AM-6PM",
            priority: 2,
            notes: "licensed electrician, good for emergencies",
          },
        },
      ]);
    } catch (err) {
      console.error("Failed to fetch call logs:", err);
      setError("Failed to load call logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      // TODO: Replace with actual API call
      // const data = await propertiesApi.getAll();
      // setProperties(data);
      
      // Mock data for development
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
      ]);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    }
  };

  const fetchVendors = async () => {
    try {
      // TODO: Replace with actual API call
      // const data = await vendorsApi.getAll();
      // setVendors(data);
      
      // Mock data for development
      setVendors([
        {
          id: "v_1",
          name: "Acme Plumbing",
          phones: ["+1 (555) 123-4567", "+1 (555) 123-4568"],
          specialties: ["plumbing"],
          hours: "24/7 Emergency Service",
          priority: 1,
          notes: "prefers SMS, fastest response time",
        },
        {
          id: "v_2",
          name: "Quick Fix Electric",
          phones: ["+1 (555) 987-6543"],
          specialties: ["electrical"],
          hours: "Mon-Fri 8AM-6PM",
          priority: 2,
          notes: "licensed electrician, good for emergencies",
        },
      ]);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    }
  };

  useEffect(() => {
    fetchCallLogs();
    fetchProperties();
    fetchVendors();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this call log?")) {
      try {
        // TODO: Replace with actual API call
        // await callLogsApi.delete(id);
        setCallLogs(callLogs.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Failed to delete call log:", err);
        alert("Failed to delete call log. Please try again.");
      }
    }
  };

  const handleSave = async (callLogData: Omit<CallLog, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingCallLog) {
        // Update existing call log
        // await callLogsApi.update(editingCallLog.id, callLogData);
        setCallLogs(callLogs.map(c => c.id === editingCallLog.id ? { 
          ...c, 
          ...callLogData,
          updatedAt: new Date().toISOString()
        } : c));
      } else {
        // Create new call log
        const newCallLog: CallLog = {
          id: `call_${Date.now()}`,
          ...callLogData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCallLogs([...callLogs, newCallLog]);
      }
      setShowForm(false);
      setEditingCallLog(null);
    } catch (err) {
      console.error("Failed to save call log:", err);
      alert("Failed to save call log. Please try again.");
    }
  };

  const filteredCallLogs = callLogs.filter(callLog => {
    const matchesSearch = searchTerm === "" || 
      callLog.callSid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      callLog.transcription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      callLog.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      callLog.property?.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || callLog.callStatus === filterStatus;
    const matchesType = filterType === "all" || callLog.callType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "missed":
        return "bg-red-100 text-red-800";
      case "voicemail":
        return "bg-yellow-100 text-yellow-800";
      case "busy":
        return "bg-orange-100 text-orange-800";
      case "failed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "inbound" ? "📞" : "📤";
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-800">Loading call logs...</span>
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
            onClick={fetchCallLogs}
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
          <h2 className="text-xl font-semibold text-gray-900">Call Logs</h2>
          <button
            onClick={() => {
              setEditingCallLog(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Call Log</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search call logs..."
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
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
            <option value="voicemail">Voicemail</option>
            <option value="busy">Busy</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border text-gray-900 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="all">All Types</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>
          <button 
            onClick={fetchCallLogs}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {showForm && (
        <CallLogForm
          callLog={editingCallLog}
          onClose={() => {
            setShowForm(false);
            setEditingCallLog(null);
          }}
          onSave={handleSave}
          properties={properties}
          vendors={vendors}
        />
      )}

      <div className="divide-y">
        {filteredCallLogs.length === 0 ? (
          <div className="p-6 text-center text-gray-800">
            {searchTerm ? "No call logs match your search" : "No call logs found"}
          </div>
        ) : (
          filteredCallLogs.map((callLog, index) => (
            <motion.div 
              key={callLog.id} 
              className="p-6 hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(callLog.callType)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {callLog.callSid}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(callLog.callStatus)}`}>
                      {callLog.callStatus}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatDuration(callLog.duration)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-800">
                      <span className="font-medium">Property:</span>
                      <span>{callLog.property?.address}{callLog.property?.unit && `, ${callLog.property.unit}`}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-800">
                      <span className="font-medium">Vendor:</span>
                      <span>{callLog.vendor?.name || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-800">
                      <span className="font-medium">Tenant:</span>
                      <span>{callLog.tenant ? `${callLog.tenant.firstName} ${callLog.tenant.lastName}` : "N/A"}</span>
                    </div>
                  </div>

                  {callLog.summary && (
                    <div className="text-sm text-gray-800 mb-2">
                      <span className="font-medium">Summary:</span> {callLog.summary}
                    </div>
                  )}

                  {callLog.transcription && (
                    <div className="text-sm text-gray-800 mb-2 bg-gray-50 p-3 rounded">
                      <span className="font-medium">Transcription:</span>
                      <p className="mt-1 italic">"{callLog.transcription}"</p>
                    </div>
                  )}

                  {callLog.recordingUrl && (
                    <div className="text-sm text-gray-800 mb-2">
                      <span className="font-medium">Recording:</span>
                      <a 
                        href={callLog.recordingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        Listen to recording
                      </a>
                    </div>
                  )}

                  {callLog.notes && (
                    <p className="text-sm text-gray-800 mt-2 bg-gray-50 p-2 rounded">
                      <span className="font-medium">Notes:</span> {callLog.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingCallLog(callLog);
                      setShowForm(true);
                    }}
                    className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(callLog.id)}
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
