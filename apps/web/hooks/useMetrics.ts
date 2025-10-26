import { useState, useEffect } from "react";
import { metricsApi } from "@/lib/api";

export interface MetricsData {
  tickets: {
    total: number;
    open: number;
    scheduled: number;
    closed: number;
  };
  appointments: {
    total: number;
    confirmed: number;
  };
  events: {
    pending: number;
  };
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await metricsApi.getMetrics();
      setMetrics(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch metrics");
      console.error("Error fetching metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { 
    metrics, 
    loading, 
    error, 
    lastUpdated,
    refetch: fetchMetrics 
  };
}
