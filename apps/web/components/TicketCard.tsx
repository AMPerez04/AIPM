"use client";

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
    <div
      onClick={onClick}
      className="p-6 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-200"
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
              {ticket.status}
            </span>
          </div>

          <p className="text-lg font-medium text-gray-900 mb-1">
            {ticket.category}
          </p>
          <p className="text-gray-600 mb-2">{ticket.description}</p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Window: {ticket.window}</span>
            <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* TODO: Add action buttons (e.g., view timeline, play recording) */}
        <div className="ml-4">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors">
            View →
          </button>
        </div>
      </div>
    </div>
  );
}

