"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import TicketCard from "./TicketCard";
import { ticketsApi } from "@/lib/api";

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
  tenantPhone?: string;
  propertyAddress?: string;
}

interface TicketListProps {
  onSelectTicket: (ticketId: string) => void;
}

export default function TicketList({ onSelectTicket }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketsApi.getRecent();
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      setError("Failed to load tickets. Please try again.");
      // Fallback to mock data for development
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
          tenantPhone: "+1 (555) 123-4567",
          propertyAddress: "123 Main St, Apt 2A",
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
          tenantPhone: "+1 (555) 987-6543",
          propertyAddress: "456 Oak Ave, Unit 1B",
        },
        {
          id: "t_125",
          tenantId: "ten_3",
          propertyId: "prop_1",
          category: "electrical",
          severity: "emergency",
          description: "power outage in kitchen",
          window: "today 2-6pm",
          status: "vendor_contacting",
          createdAt: new Date().toISOString(),
          tenantPhone: "+1 (555) 456-7890",
          propertyAddress: "123 Main St, Apt 2A",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === "all" || ticket.status === filter;
    const matchesSearch = searchTerm === "" || 
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.propertyAddress && ticket.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading service requests...</span>
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
            onClick={fetchTickets}
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
          <h2 className="text-xl font-semibold text-gray-900">Service Requests</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors w-64"
            />
            <button 
              onClick={fetchTickets}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all" 
                ? "bg-[#6366F1] text-white shadow-sm" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({tickets.length})
          </button>
          <button
            onClick={() => setFilter("new")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "new" 
                ? "bg-[#6366F1] text-white shadow-sm" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            New ({tickets.filter(t => t.status === "new").length})
          </button>
          <button
            onClick={() => setFilter("vendor_contacting")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "vendor_contacting" 
                ? "bg-[#6366F1] text-white shadow-sm" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            In Progress ({tickets.filter(t => t.status === "vendor_contacting").length})
          </button>
          <button
            onClick={() => setFilter("scheduled")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "scheduled" 
                ? "bg-[#6366F1] text-white shadow-sm" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Scheduled ({tickets.filter(t => t.status === "scheduled").length})
          </button>
        </div>
      </div>

      <div className="divide-y">
        {filteredTickets.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            {searchTerm ? "No tickets match your search" : "No service requests found"}
          </div>
        ) : (
          filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <TicketCard
                ticket={ticket}
                onClick={() => onSelectTicket(ticket.id)}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

