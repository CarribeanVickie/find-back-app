import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthContext";

// Database item type
export interface DbItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  description: string;
  image_url: string | null;
  type: "lost" | "found";
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Helper to work around types not being regenerated yet
const itemsTable = () => supabase.from("items" as never);

export const useItems = () => {
  const [items, setItems] = useState<DbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuthContext();

  // Fetch approved items (public view)
  const fetchApprovedItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await itemsTable()
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setItems(data as unknown as DbItem[]);
    }
    setLoading(false);
  }, []);

  // Fetch user's own items
  const fetchUserItems = useCallback(async () => {
    if (!user) return [];
    
    const { data, error } = await itemsTable()
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    return error ? [] : (data as unknown as DbItem[]);
  }, [user]);

  // Fetch all items for admin
  const fetchAllItems = useCallback(async () => {
    if (!isAdmin) return [];
    
    const { data, error } = await itemsTable()
      .select("*")
      .order("created_at", { ascending: false });
    
    return error ? [] : (data as unknown as DbItem[]);
  }, [isAdmin]);

  // Fetch pending items for admin
  const fetchPendingItems = useCallback(async () => {
    if (!isAdmin) return [];
    
    const { data, error } = await itemsTable()
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    
    return error ? [] : (data as unknown as DbItem[]);
  }, [isAdmin]);

  // Add a new item
  const addItem = async (item: {
    name: string;
    category: string;
    description: string;
    image_url?: string;
    type: "lost" | "found";
  }) => {
    if (!user) throw new Error("Must be logged in");
    
    const { data, error } = await itemsTable()
      .insert({
        user_id: user.id,
        name: item.name,
        category: item.category,
        description: item.description,
        image_url: item.image_url || null,
        type: item.type,
        status: "pending",
      } as never)
      .select()
      .single();
    
    if (error) throw error;
    return data as unknown as DbItem;
  };

  // Update item status (admin only)
  const updateItemStatus = async (
    itemId: string,
    status: "approved" | "rejected",
    notes?: string
  ) => {
    if (!isAdmin) throw new Error("Admin access required");
    
    const { error } = await itemsTable()
      .update({ status, admin_notes: notes || null } as never)
      .eq("id", itemId);
    
    if (error) throw error;
  };

  // Get single item by ID
  const getItemById = async (id: string) => {
    const { data, error } = await itemsTable()
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    return error ? null : (data as unknown as DbItem | null);
  };

  // Upload image to storage
  const uploadImage = async (file: File) => {
    if (!user) throw new Error("Must be logged in");
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("item-images")
      .upload(fileName, file);
    
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from("item-images")
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  };

  useEffect(() => {
    fetchApprovedItems();
  }, [fetchApprovedItems]);

  return {
    items,
    loading,
    addItem,
    updateItemStatus,
    getItemById,
    uploadImage,
    fetchApprovedItems,
    fetchUserItems,
    fetchAllItems,
    fetchPendingItems,
  };
};
