"use client";

import { useState, useEffect } from "react";
import { ticketsApi } from "@/lib/api";

interface TimelineEvent {
  id: string;
  type: string;
  timestamp: string;
  description: string;
  metadata?: any;
}

interface TimelineProps {
  ticketId: string;
}

export default function Timeline({ ticketId }: TimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketsApi.getTimeline(ticketId);
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch timeline:", err);
      setError("Failed to load timeline. Please try again.");
      // Fallback to mock data for development
      setEvents([
        {
          id: "e_1",
          type: "created",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          description: "Service request created by tenant",
          metadata: { source: "AI Agent" }
        },
        {
          id: "e_2",
          type: "ai_analysis",
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          description: "AI Agent analyzed request and categorized as plumbing emergency",
          metadata: { confidence: 0.95 }
        },
        {
          id: "e_3",
          type: "vendor_search",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          description: "Searching for available plumbers in the area",
          metadata: { searchRadius: "5 miles" }
        },
        {
          id: "e_4",
          type: "vendor_contacted",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          description: "Contacted Acme Plumbing - waiting for response",
          metadata: { vendor: "Acme Plumbing", phone: "+1 (555) 123-4567" }
        },
        {
          id: "e_5",
          type: "vendor_response",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          description: "Acme Plumbing confirmed availability for today 1-5pm",
          metadata: { response: "accepted", eta: "2-3 hours" }
        },
        {
          id: "e_6",
          type: "appointment_scheduled",
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          description: "Appointment scheduled with tenant for today 1-5pm",
          metadata: { appointmentId: "apt_123", status: "confirmed" }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [ticketId]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "created":
        return "🎫";
      case "ai_analysis":
        return "🤖";
      case "vendor_search":
        return "🔍";
      case "vendor_contacted":
        return "📞";
      case "vendor_response":
        return "✅";
      case "appointment_scheduled":
        return "📅";
      case "status_change":
        return "🔄";
      default:
        return "📝";
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "created":
        return "bg-blue-100 text-blue-800";
      case "ai_analysis":
        return "bg-purple-100 text-purple-800";
      case "vendor_search":
        return "bg-yellow-100 text-yellow-800";
      case "vendor_contacted":
        return "bg-orange-100 text-orange-800";
      case "vendor_response":
        return "bg-green-100 text-green-800";
      case "appointment_scheduled":
        return "bg-green-100 text-green-800";
      case "status_change":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading timeline...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchTimeline}
          className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <div className="text-4xl mb-2">📋</div>
          <p>No timeline events yet</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {events.map((event, index) => (
            <div key={event.id} className="relative flex items-start space-x-4 pb-6">
              {/* Event icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              
              {/* Event content */}
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                    {event.metadata && (
                      <div className="text-xs text-gray-400">
                        {event.type.replace('_', ' ')}
                      </div>
                    )}
                  </div>
                  
                  {/* Show metadata if available */}
                  {event.metadata && (
                    <div className="mt-2 text-xs text-gray-600">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div key={key} className="flex">
                          <span className="font-medium capitalize">{key}:</span>
                          <span className="ml-1">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

