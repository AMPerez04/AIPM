"use client";

import { useState, useEffect, useCallback } from "react";
import Timeline from "./Timeline";
import { ticketsApi } from "@/lib/api";

interface TicketDetailProps {
  ticketId: string;
  onClose: () => void;
}

interface Ticket {
  id: string;
  tenantId: string;
  propertyId: string;
  category: string;
  severity: string;
  description: string;
  window: string;
  status: string;
  createdAt: string;
  tenantPhone: string;
  propertyAddress: string;
}

export default function TicketDetail({ ticketId, onClose }: TicketDetailProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTicketDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ticketsApi.getById(ticketId);
      setTicket(data);
    } catch (err) {
      console.error("Failed to fetch ticket details:", err);
      // Fallback to mock data for development
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
        tenantPhone: "+1 (555) 123-4567",
        propertyAddress: "123 Main St, Apt 2A",
      });
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p className="text-gray-800">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 ">Ticket Details</h2>
          <button
            onClick={onClose}
            className="text-gray-800 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {ticket && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-800">ID</p>
                    <p className="font-medium text-gray-900">{ticket.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">Category</p>
                    <p className="font-medium text-gray-900">{ticket.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">Severity</p>
                    <p className="font-medium text-gray-900">{ticket.severity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">Status</p>
                    <p className="font-medium text-gray-900">{ticket.status}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Description</h3>
                <p className="text-gray-900">{ticket.description}</p>
              </div>

              {/* TODO: Add appointment details if scheduled */}
              {/* TODO: Add recording playback */}
              {/* TODO: Add transcript display */}

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Timeline</h3>
                <Timeline ticketId={ticketId} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

