"use client";

import { useState } from "react";
import MetricsPanel from "@/components/MetricsPanel";
import TicketList from "@/components/TicketList";
import TicketDetail from "@/components/TicketDetail";
import VendorList from "@/components/VendorList";
import Header from "@/components/Header";

export default function PropertyOwnerDashboard() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"tickets" | "vendors">("tickets");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showHomeLink={true} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200 w-fit">
            <button
              onClick={() => setActiveTab("tickets")}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "tickets"
                  ? "bg-[#6366F1] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Service Requests
            </button>
            <button
              onClick={() => setActiveTab("vendors")}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "vendors"
                  ? "bg-[#6366F1] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Vendors
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Metrics Panel */}
          <div className="lg:col-span-1">
            <MetricsPanel />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "tickets" ? (
              <TicketList onSelectTicket={setSelectedTicket} />
            ) : (
              <VendorList />
            )}
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
