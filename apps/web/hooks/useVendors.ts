import { useState, useEffect } from "react";
import { vendorsApi } from "@/lib/api";

// TODO: Add proper TypeScript types from @shared/types
// TODO: Add error handling
// TODO: Add loading states
// TODO: Add CRUD operations

export function useVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      // TODO: Call actual API
      // const data = await vendorsApi.getAll();
      // setVendors(data);
      setVendors([]);
    } catch (err) {
      setError("Failed to fetch vendors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createVendor = async (data: any) => {
    try {
      // TODO: Call actual API
      // const newVendor = await vendorsApi.create(data);
      // setVendors([...vendors, newVendor]);
      fetchVendors();
    } catch (err) {
      setError("Failed to create vendor");
      throw err;
    }
  };

  const updateVendor = async (id: string, data: any) => {
    try {
      // TODO: Call actual API
      // await vendorsApi.update(id, data);
      fetchVendors();
    } catch (err) {
      setError("Failed to update vendor");
      throw err;
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      // TODO: Call actual API
      // await vendorsApi.delete(id);
      setVendors(vendors.filter((v) => v.id !== id));
    } catch (err) {
      setError("Failed to delete vendor");
      throw err;
    }
  };

  return {
    vendors,
    loading,
    error,
    createVendor,
    updateVendor,
    deleteVendor,
    refetch: fetchVendors,
  };
}

