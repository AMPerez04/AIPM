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
    timeToBook: 0,
    callsHandled: 0,
    openTickets: 0,
    scheduledAppointments: 0,
  });

  // TODO: Implement fetchMetrics function
  useEffect(() => {
    // Simulated data for now
    setMetrics({
      timeToBook: 15,
      callsHandled: 42,
      openTickets: 8,
      scheduledAppointments: 5,
    });
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Metrics</h2>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <p className="text-sm text-gray-600">Time to Book</p>
          <p className="text-3xl font-bold text-blue-600">
            {metrics.timeToBook}s
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="text-sm text-gray-600">Calls Handled Today</p>
          <p className="text-3xl font-bold text-green-600">
            {metrics.callsHandled}
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="text-sm text-gray-600">Open Tickets</p>
          <p className="text-3xl font-bold text-orange-600">
            {metrics.openTickets}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Scheduled</p>
          <p className="text-3xl font-bold text-purple-600">
            {metrics.scheduledAppointments}
          </p>
        </div>
      </div>

      {/* TODO: Add Simulate Vendor YES toggle */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
          <span className="text-sm text-gray-700 font-medium">Simulate Vendor YES</span>
        </label>
      </div>
    </div>
  );
}

