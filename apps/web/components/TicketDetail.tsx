"use client";

import { useState, useEffect } from "react";
import Timeline from "./Timeline";

// TODO: Fetch ticket details via GET /tickets/:id
// TODO: Fetch timeline via GET /tickets/:id/timeline
// TODO: Display appointment details if scheduled
// TODO: Show audit log entries chronologically
// TODO: Display vendor ping attempts
// TODO: Add "Play Recording" button
// TODO: Show transcript if available
// TODO: Add status badges and icons
// TODO: Handle loading and error states

interface TicketDetailProps {
  ticketId: string;
  onClose: () => void;
}

export default function TicketDetail({ ticketId, onClose }: TicketDetailProps) {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // TODO: Implement fetchTicketDetails function
  useEffect(() => {
    // Simulated data for now
    setTimeout(() => {
      setTicket({
        id: ticketId,
        tenantId: "ten_1",
        propertyId: "prop_1",
        category: "plumbing",
        severity: "emergency",
        description: "leak under sink",
        window: "today 1-5pm",
        status: "new",
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
    }, 500);
  }, [ticketId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p className="text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Ticket Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {ticket && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">ID</p>
                    <p className="font-medium">{ticket.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium">{ticket.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Severity</p>
                    <p className="font-medium">{ticket.severity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium">{ticket.status}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{ticket.description}</p>
              </div>

              {/* TODO: Add appointment details if scheduled */}
              {/* TODO: Add recording playback */}
              {/* TODO: Add transcript display */}

              <div>
                <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                <Timeline ticketId={ticketId} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

