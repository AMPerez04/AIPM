import axios from "axios";

// TODO: Configure API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// TODO: Add error handling and retry logic
// TODO: Add request/response interceptors
// TODO: Handle authentication tokens

export const ticketsApi = {
  // GET /tickets?recent=true
  getRecent: async () => {
    const response = await api.get("/tickets", { params: { recent: true } });
    return response.data;
  },

  // GET /tickets/:id
  getById: async (id: string) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // GET /tickets/:id/timeline
  getTimeline: async (id: string) => {
    const response = await api.get(`/tickets/${id}/timeline`);
    return response.data;
  },

  // POST /tickets
  create: async (data: Record<string, unknown>) => {
    const response = await api.post("/tickets", data);
    return response.data;
  },
};

export const vendorsApi = {
  // GET /vendors
  getAll: async () => {
    const response = await api.get("/vendors");
    return response.data;
  },

  // POST /vendors
  create: async (data: Record<string, unknown>) => {
    const response = await api.post("/vendors", data);
    return response.data;
  },

  // PUT /vendors/:id
  update: async (id: string, data: Record<string, unknown>) => {
    const response = await api.put(`/vendors/${id}`, data);
    return response.data;
  },

  // DELETE /vendors/:id
  delete: async (id: string) => {
    const response = await api.delete(`/vendors/${id}`);
    return response.data;
  },
};

export const notifyApi = {
  // POST /notify
  send: async (data: Record<string, unknown>) => {
    const response = await api.post("/notify", data);
    return response.data;
  },
};

export default api;

