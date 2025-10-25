"use client";

import { motion } from "motion/react";

// TODO: Display all ticket fields properly
// TODO: Add status badge colors
// TODO: Add emergency indicator
// TODO: Format dates properly
// TODO: Show tenant name (need to fetch)
// TODO: Add hover effects

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

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

export default function TicketCard({ ticket, onClick }: TicketCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "vendor_contacting":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    return severity === "emergency"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";
  };

  return (
    <motion.div
      onClick={onClick}
      className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
        ticket.severity === "emergency" 
          ? "border-red-400 hover:border-red-300" 
          : "border-transparent hover:border-blue-200"
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold text-gray-900">#{ticket.id}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                ticket.severity
              )}`}
            >
              {ticket.severity}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                ticket.status
              )}`}
            >
              {ticket.status.replace('_', ' ')}
            </span>
            {ticket.severity === "emergency" && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                URGENT
              </span>
            )}
          </div>

          <p className="text-lg font-medium text-gray-900 mb-1 capitalize">
            {ticket.category} Issue
          </p>
          <p className="text-gray-600 mb-3">{ticket.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            {ticket.propertyAddress && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{ticket.propertyAddress}</span>
              </div>
            )}
            {ticket.tenantPhone && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{ticket.tenantPhone}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>⏰ {ticket.window}</span>
            <span>📅 {new Date(ticket.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="ml-4 flex flex-col items-end space-y-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors">
            View Details →
          </button>
          {ticket.severity === "emergency" && (
            <span className="text-xs text-red-600 font-medium">
              Priority Response
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

