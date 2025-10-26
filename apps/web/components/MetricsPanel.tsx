"use client";

import { useMetrics } from "@/hooks/useMetrics";

export default function MetricsPanel() {
  const { metrics, loading, error, lastUpdated } = useMetrics();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
        </div>
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">⚠️ Failed to load metrics</div>
          <div className="text-sm text-gray-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  // Calculate derived metrics
  const activeRequests = metrics.tickets.open;
  const emergencyRequests = metrics.tickets.open; // TODO: Filter by severity when API supports it
  const scheduledToday = metrics.tickets.scheduled;
  const totalProperties = 9; // TODO: Fetch from properties API
  const avgResponseTime = 3; // TODO: Calculate from actual response times

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
      </div>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <p className="text-sm text-gray-600">Active Requests</p>
          <p className="text-3xl font-bold text-blue-600">
            {activeRequests}
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="text-sm text-gray-600">Emergency Requests</p>
          <p className="text-3xl font-bold text-red-600">
            {emergencyRequests}
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="text-sm text-gray-600">Scheduled Today</p>
          <p className="text-3xl font-bold text-green-600">
            {scheduledToday}
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="text-sm text-gray-600">Avg Response Time</p>
          <p className="text-3xl font-bold text-purple-600">
            {avgResponseTime}m
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Total Properties</p>
          <p className="text-3xl font-bold text-gray-600">
            {totalProperties}
          </p>
        </div>
      </div>

      {/* AI Agent Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 font-medium">AI Agent</span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            active
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Automatically handling tenant requests
        </p>
        {lastUpdated && (
          <p className="text-xs text-gray-400 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}

