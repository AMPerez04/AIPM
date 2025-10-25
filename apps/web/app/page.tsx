"use client";

import { useState } from "react";
import MetricsPanel from "@/components/MetricsPanel";
import TicketList from "@/components/TicketList";
import TicketDetail from "@/components/TicketDetail";
import Header from "@/components/Header";

// TODO: Add navigation/routing
// TODO: Create sidebar navigation component
// TODO: Implement responsive grid layout
// TODO: Add loading states

export default function Dashboard() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Metrics Panel */}
          <div className="lg:col-span-1">
            <MetricsPanel />
          </div>

          {/* Tickets List */}
          <div className="lg:col-span-3">
            <TicketList onSelectTicket={setSelectedTicket} />
          </div>
        </div>
      </main>

      {/* Show TicketDetail modal when selectedTicket is set */}
      {selectedTicket && (
        <TicketDetail ticketId={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
}
