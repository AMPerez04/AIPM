"use client";

import { useState, useEffect } from "react";
import TicketCard from "./TicketCard";

// TODO: Fetch tickets via GET /tickets?recent=true
// TODO: Add filtering by status
// TODO: Add sorting options
// TODO: Implement pagination
// TODO: Add search functionality
// TODO: Show emergency tickets highlighted
// TODO: Handle loading and error states

interface Ticket {
  id: string;
  tenantId: string;
  propertyId: string;
  category: string;
  severity: "emergency" | "routine";
  description: string;
  window: string;
  status: "new" | "vendor_contacting" | "scheduled" | "closed";
  createdAt: string;
}

interface TicketListProps {
  onSelectTicket: (ticketId: string) => void;
}

export default function TicketList({ onSelectTicket }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  // TODO: Implement fetchTickets function
  useEffect(() => {
    // Simulated data for now
    setTimeout(() => {
      setTickets([
        {
          id: "t_123",
          tenantId: "ten_1",
          propertyId: "prop_1",
          category: "plumbing",
          severity: "emergency",
          description: "leak under sink",
          window: "today 1-5pm",
          status: "new",
          createdAt: new Date().toISOString(),
        },
        {
          id: "t_124",
          tenantId: "ten_2",
          propertyId: "prop_2",
          category: "hvac",
          severity: "routine",
          description: "AC not working",
          window: "tomorrow 9am-12pm",
          status: "scheduled",
          createdAt: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredTickets = filter === "all" 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Tickets</h2>
          
          {/* TODO: Add search input */}
          <input
            type="text"
            placeholder="Search tickets..."
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        {/* TODO: Add filter buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("new")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "new" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            New
          </button>
          <button
            onClick={() => setFilter("scheduled")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "scheduled" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Scheduled
          </button>
        </div>
      </div>

      <div className="divide-y">
        {filteredTickets.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No tickets found
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => onSelectTicket(ticket.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

