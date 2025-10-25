"use client";

import { useState, useEffect } from "react";

// TODO: Fetch real metrics from API
// TODO: Auto-refresh every 30s
// TODO: Add charts/graphs (optional)
// TODO: Add "Simulate Vendor YES" toggle
// TODO: Display time-to-book metric
// TODO: Show calls handled today
// TODO: Display open tickets count
// TODO: Show scheduled appointments

export default function MetricsPanel() {
  const [metrics, setMetrics] = useState({
    activeRequests: 0,
    emergencyRequests: 0,
    scheduledToday: 0,
    avgResponseTime: 0,
    totalProperties: 0,
    aiAgentStatus: "active"
  });

  // TODO: Implement fetchMetrics function
  useEffect(() => {
    // Simulated data for now
    setMetrics({
      activeRequests: 8,
      emergencyRequests: 2,
      scheduledToday: 5,
      avgResponseTime: 12,
      totalProperties: 12,
      aiAgentStatus: "active"
    });
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <div className={`w-2 h-2 rounded-full ${
          metrics.aiAgentStatus === "active" ? "bg-green-500" : "bg-red-500"
        }`}></div>
      </div>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <p className="text-sm text-gray-600">Active Requests</p>
          <p className="text-3xl font-bold text-blue-600">
            {metrics.activeRequests}
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="text-sm text-gray-600">Emergency Requests</p>
          <p className="text-3xl font-bold text-red-600">
            {metrics.emergencyRequests}
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="text-sm text-gray-600">Scheduled Today</p>
          <p className="text-3xl font-bold text-green-600">
            {metrics.scheduledToday}
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="text-sm text-gray-600">Avg Response Time</p>
          <p className="text-3xl font-bold text-purple-600">
            {metrics.avgResponseTime}m
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Total Properties</p>
          <p className="text-3xl font-bold text-gray-600">
            {metrics.totalProperties}
          </p>
        </div>
      </div>

      {/* AI Agent Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 font-medium">AI Agent</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            metrics.aiAgentStatus === "active" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {metrics.aiAgentStatus}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Automatically handling tenant requests
        </p>
      </div>
    </div>
  );
}

