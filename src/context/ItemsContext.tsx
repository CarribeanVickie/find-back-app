import React, { createContext, useContext, useState, ReactNode } from "react";
import { Item } from "@/types/item";
import { initialItems } from "@/data/mockItems";

// Context to manage items state across the app
interface ItemsContextType {
  items: Item[];
  addItem: (item: Omit<Item, "id" | "dateReported">) => void;
  getItemById: (id: string) => Item | undefined;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

// Generate unique ID for new items
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const ItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>(initialItems);

  // Add a new item to the array
  const addItem = (itemData: Omit<Item, "id" | "dateReported">) => {
    const newItem: Item = {
      ...itemData,
      id: generateId(),
      dateReported: new Date(),
    };
    setItems((prev) => [newItem, ...prev]);
  };

  // Find item by ID for detail view
  const getItemById = (id: string): Item | undefined => {
    return items.find((item) => item.id === id);
  };

  return (
    <ItemsContext.Provider value={{ items, addItem, getItemById }}>
      {children}
    </ItemsContext.Provider>
  );
};

// Custom hook for using items context
export const useItems = (): ItemsContextType => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
};
