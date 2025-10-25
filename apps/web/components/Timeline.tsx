"use client";

import { useState, useEffect } from "react";

// TODO: Fetch timeline via GET /tickets/:id/timeline
// TODO: Display audit log entries chronologically
// TODO: Show vendor ping attempts
// TODO: Show status transitions
// TODO: Format timestamps properly
// TODO: Add icons for different event types

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

  // TODO: Implement fetchTimeline function
  useEffect(() => {
    // Simulated data for now
    setTimeout(() => {
      setEvents([
        {
          id: "e_1",
          type: "created",
          timestamp: new Date().toISOString(),
          description: "Ticket created",
        },
        {
          id: "e_2",
          type: "vendor_ping",
          timestamp: new Date().toISOString(),
          description: "Vendor Acme Plumbing contacted",
        },
      ]);
      setLoading(false);
    }, 500);
  }, [ticketId]);

  if (loading) {
    return <p className="text-gray-600">Loading timeline...</p>;
  }

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <p className="text-gray-600">No timeline events yet</p>
      ) : (
        events.map((event) => (
          <div key={event.id} className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {event.description}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

