"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import MetricsPanel from "@/components/MetricsPanel";
import TicketList from "@/components/TicketList";
import TicketDetail from "@/components/TicketDetail";
import VendorList from "@/components/VendorList";
import PropertyList from "@/components/PropertyList";
import CallLogList from "@/components/CallLogList";
import Header from "@/components/Header";

export default function PropertyOwnerDashboard() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"tickets" | "vendors" | "properties" | "call-logs">("tickets");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showHomeLink={true} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200 w-fit">
            <motion.button
              onClick={() => setActiveTab("tickets")}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "tickets"
                  ? "bg-[#6366F1] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Service Requests
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("vendors")}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "vendors"
                  ? "bg-[#6366F1] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Vendors
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("properties")}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "properties"
                  ? "bg-[#6366F1] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Properties
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("call-logs")}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "call-logs"
                  ? "bg-[#6366F1] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Call Logs
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Metrics Panel */}
          <div className="lg:col-span-1">
            <MetricsPanel />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === "tickets" && (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TicketList onSelectTicket={setSelectedTicket} />
                </motion.div>
              )}
              {activeTab === "vendors" && (
                <motion.div
                  key="vendors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <VendorList />
                </motion.div>
              )}
              {activeTab === "properties" && (
                <motion.div
                  key="properties"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <PropertyList />
                </motion.div>
              )}
              {activeTab === "call-logs" && (
                <motion.div
                  key="call-logs"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <CallLogList />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Show TicketDetail modal when selectedTicket is set */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <TicketDetail
                ticketId={selectedTicket}
                onClose={() => setSelectedTicket(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
