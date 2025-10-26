import { useState, useEffect } from "react";
import { ticketsApi } from "@/lib/api";

// TODO: Add proper TypeScript types from @shared/types
// TODO: Add error handling
// TODO: Add loading states
// TODO: Add caching/refetch logic

export function useTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketsApi.getRecent();
      setTickets(data);
    } catch (err) {
      setError("Failed to fetch tickets");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { tickets, loading, error, refetch: fetchTickets };
}

export function useTicket(id: string) {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTicket();
    }
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketsApi.getById(id);
      setTicket(data);
    } catch (err) {
      setError("Failed to fetch ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { ticket, loading, error, refetch: fetchTicket };
}

export function useTicketTimeline(id: string) {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTimeline();
    }
  }, [id]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketsApi.getTimeline(id);
      setTimeline(data);
    } catch (err) {
      setError("Failed to fetch timeline");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { timeline, loading, error, refetch: fetchTimeline };
}

